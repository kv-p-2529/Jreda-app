import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useScrollToTop } from '@/components/layout/ScreenLayout';
import Header from '@/components/Header';
import VerifyAadharScreen from './aadhaar/VerifyAadharScreen';
import VerifyOtpScreen from './aadhaar/VerifyOtpScreen';
import PersonalDetailsScreen from './details/PersonalDetailsScreen';
import { mapDraftToFormValues } from './details/personalDetailsPayload';
import DocumentsScreen from './documents/DocumentsScreen';
import PreviewScreen from './preview/PreviewScreen';
import PaymentScreen from './payment/PaymentScreen';
import RegistrationSuccessModal from './payment/RegistrationSuccessModal';
import PaymentFailedModal from './payment/PaymentFailedModal';

import { payRegistrationFee } from '@/services/payment';
import type { ReceiptData } from '@/pdfs/PaymentReceipt';

import {
  AadhaarValues,
  DocumentsValues,
  PersonalDetailsValues,
} from './registrationSchemas';
import {
  APPLICANT_CATEGORY,
  APPLICATION_CATEGORY,
  CONTROLLER_TYPE,
  DISTRICTS,
  GENDER,
  getOptionLabel,
  PUMP_CAPACITY,
  PUMP_CATEGORY,
  PUMP_SUB_TYPE,
  PUMP_TYPE,
  buildMasterOptions,
} from './registrationOptions';
import authApi from '@/api/authApi';
import throwError from '@/api/throwError';
import axios from 'axios';
import { showToast } from '@/utils/helpers';
import apiClient from '@/api/apiClient';
import { getFullUrl } from '@/services/baseService';

// Orchestrator for the multi-step registration wizard. Each step is its own
// screen component; this file owns the state machine that decides what to
// render and stitches the data captured at each step together.
//
// Flow:
//   aadhaar  -> otp  -> details  -> documents  -> preview  -> payment
//                                                      |
//                                                      └→ success modal
//                                                      └→ failed modal -> retry
//
// `aadhaarData`, `detailsData`, `documentsData` are step-by-step accumulators
// — kept here (not lifted into rhf at parent) because each step uses its OWN
// rhf form; this state survives across step transitions.

type Step = 'aadhaar' | 'otp' | 'details' | 'documents' | 'preview' | 'payment';

// Mocked IDs and fee structure — replace with values from the registration
// API response once the backend is live. The fee breakdown (registration +
// convenience + GST) is reused by both the Payment screen and the success
// modal, so keep them in one place.
const REFERENCE_NO = 'TEMP-KUSUM-2026-0123';
const APPLICATION_ID = 'KUSUM-2026-000123';
const PAYMENT_ID = 'PAY-JH-2026-000456878';
const REGISTRATION_FEE = 500;
const CONVENIENCE_FEE = 20;
const GST_PERCENT = 18;

function RegisterIndex() {
  const {
    masterListApi,
    aadhaarGetOtpApi,
    aadhaarVerifyOtpApi,
    registerStartApi,
    registerResumeApi,
    registerSectionUpdateApi,
    registerPreviewApi,
  } = authApi();

  const navigation = useNavigation<any>();
  const scrollToTop = useScrollToTop();
  const [step, setStep] = useState<Step>('aadhaar');
  const [loader, setLoader] = useState('');
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<PersonalDetailsValues | null>(
    null,
  );
  // value→label lookup for the PersonalDetails select fields, captured at submit
  // so the preview shows names (e.g. "Barhi") instead of stored codes ("2645").
  const [detailsLabels, setDetailsLabels] = useState<Record<string, string>>(
    {},
  );
  const [documentsData, setDocumentsData] = useState<DocumentsValues | null>(
    null,
  );

  const [masterList, setMasterList] = useState(null);
  // Resumed draft from GET /registration/:token — the backend's flat row, used
  // to prefill the details form (mapped via mapDraftToFormValues).
  const [draftData, setDraftData] = useState<any>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [failedOpen, setFailedOpen] = useState(false);
  // Razorpay checkout is in flight — drives the Pay button spinner so the user
  // can't double-tap into two checkout sheets.
  const [paying, setPaying] = useState(false);
  // Real payment id from a successful charge; falls back to the placeholder
  // while the backend (which would mint the application id) isn't live.
  const [paymentId, setPaymentId] = useState<string | null>(null);
  // Registration session token from POST /registration/start. Threaded into the
  // resume / section-update / preview calls that all key off it.
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Stepping through the wizard swaps content within the SAME route, so the
  // navigator's focus-based scroll reset never fires. Reset the scroll position
  // ourselves on every step change so each step starts at the top.
  useEffect(() => {
    scrollToTop();
  }, [step, scrollToTop]);

  const initiateRegistrationFun = () => {
    setLoader('initiate');
    axios
      .post<any>(registerStartApi)
      .then(res => {
        console.log('Registration initiated', res.data?.data);
        setSessionToken(res?.data?.data?.session_token);
      })
      .catch(err => {
        throwError(err);
        navigation.goBack();
      })
      .finally(() => setLoader(''));
  };

  const fetchMasterList = () => {
    setLoader('master');
    axios
      .get<any>(getFullUrl(masterListApi))
      .then(res => {
        console.log('Master list fetched', res.data?.data);
        setMasterList(res?.data?.data);
      })
      .catch(err => {
        throwError(err);
        navigation.goBack();
      })
      .finally(() => setLoader(''));
  };

  // Fire once on mount and stash the returned session token.
  useEffect(() => {
    fetchMasterList();
  }, []);

  // Reshape the master-list API response into the SelectOption[] shape the
  // PersonalDetails dropdowns expect. Recomputed only when the response lands.
  const masterOptions = useMemo(
    () => buildMasterOptions(masterList),
    [masterList],
  );

  const headerTitle = useMemo(() => {
    if (step === 'aadhaar') return 'Apply for PM-KUSUM Registration';
    if (step === 'preview') return 'Review Your Application';
    if (step === 'payment') return 'Payment';
    return 'Complete your Registration';
  }, [step]);

  const amountString = useMemo(() => {
    const base = REGISTRATION_FEE + CONVENIENCE_FEE;
    const gst = (base * GST_PERCENT) / 100;
    return `₹${(base + gst).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  const dateString = useMemo(() => {
    const d = new Date();
    const date = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date}, ${time}`;
  }, []);

  // Flatten the wizard's accumulated state into the flat, all-strings shape the
  // receipt renders. Option values are mapped back to their human labels so the
  // PDF reads "OBC" / "DC" rather than the stored "obc" / "dc" codes. Falls back
  // to '-' for anything not captured (e.g. the user skipped an optional field).
  const receiptData: ReceiptData = useMemo(
    () => ({
      paymentReferenceNo: paymentId ?? PAYMENT_ID,
      paymentDate: dateString,
      bankReferenceNo: '-',
      amount: amountString,
      orderNumber: REFERENCE_NO,
      paymentMode: 'UPI',
      applicationNumber: APPLICATION_ID,
      mobileNumber: detailsData?.mobile ?? '-',
      farmerName: detailsData?.applicantName ?? '-',
      fatherHusbandName: detailsData?.fatherName ?? '-',
      applicationCategory: getOptionLabel(
        APPLICATION_CATEGORY,
        detailsData?.applicationCategory,
      ),
      applicantType: getOptionLabel(
        APPLICANT_CATEGORY,
        detailsData?.applicantCategory,
      ),
      aadharLast4: aadhaarData?.aadhaar_number?.slice(-4) ?? '-',
      gender: getOptionLabel(GENDER, detailsData?.gender),
      locationDistrict: getOptionLabel(
        DISTRICTS,
        detailsData?.location?.district,
      ),
      emailId: detailsData?.email || '-',
      pumpCapacity: getOptionLabel(PUMP_CAPACITY, detailsData?.pumpCapacity),
      pumpCategory: getOptionLabel(PUMP_CATEGORY, detailsData?.pumpCategory),
      pumpSubType: getOptionLabel(PUMP_SUB_TYPE, detailsData?.pumpSubType),
      pumpType: getOptionLabel(PUMP_TYPE, detailsData?.pumpType),
      controllerType: getOptionLabel(
        CONTROLLER_TYPE,
        detailsData?.controllerType,
      ),
    }),
    [aadhaarData, detailsData, paymentId, amountString, dateString],
  );

  // Kick off the Razorpay checkout for the registration fee. `payRegistrationFee`
  // never throws — it resolves to success/cancelled/failed — so we just switch
  // on the result and open the matching modal.
  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    const result = await payRegistrationFee({
      fee: {
        registrationFee: REGISTRATION_FEE,
        convenienceFee: CONVENIENCE_FEE,
        gstPercent: GST_PERCENT,
      },
      referenceNo: REFERENCE_NO,
      prefill: {
        name: detailsData?.applicantName,
        email: detailsData?.email,
        contact: detailsData?.mobile,
      },
    });
    setPaying(false);

    if (result.status === 'success') {
      setPaymentId(result.paymentId);
      setSuccessOpen(true);
    } else if (result.status === 'failed' || result.status === 'cancelled') {
      // Both cancel and hard failure land on the same retry modal; the saved
      // form data lets the user pick up where they left off.
      setFailedOpen(true);
    }
  };

  if (loader === 'initiate') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Header title={headerTitle} />
        <View style={{ marginVertical: 20 }}>
          <ActivityIndicator size="large" color="#1382F5" />
          <Text>Please Wait</Text>
        </View>
      </View>
    );
  }

  const steps: Record<number, string | any> = {
    1: 'aadhaar',
    2: 'otp',
    3: 'details',
    4: 'documents',
    5: 'preview',
    6: 'payment',
  };

  const resumeRegisterationFun = (token: string) => {
    setLoader('resume');
    axios
      .get<any>(registerResumeApi(token))
      .then(res => {
        console.log('Registration resumed', res.data?.data);
        const data = res?.data?.data;
        setDraftData(data);
        setStep('details');
      })
      .catch(err => {
        throwError(err);
      })
      .finally(() => setLoader(''));
  };

  const firstStepFun = (values: any) => {
    setAadhaarData(values);

    // scenario: 'existing' 'otp_sent';
    console.log(values);

    if (values?.scenario === 'existing') {
      setSessionToken(values?.data?.session_token);
      resumeRegisterationFun(values?.data?.session_token);
      return;
    }
    initiateRegistrationFun();
    setStep('otp');
  };

  const verifyAadhaarFun = () => {
    setLoader('verify');

    const body = {
      aadhaar_number: aadhaarData?.aadhaar_number,
    };

    apiClient
      .post(aadhaarGetOtpApi, body)
      .then(res => {
        const data = res?.data?.data;
        showToast('OTP sent to your Aadhaar-linked mobile number');
        firstStepFun({ ...data, ...body });
      })
      .catch(err => throwError(err))
      .finally(() => setLoader(''));
  };

  // const updateFormStatus = (section: string | number, retriesLeft = 2) => {
  //   axios
  //     .put(registerSectionUpdateApi(sessionToken ?? '', section))
  //     .then(res => {
  //       console.log('Form status updated', res.data);
  //     })
  //     .catch(err => {
  //       // Retry up to twice (3 attempts total), then give up and surface the
  //       // error instead of looping forever.
  //       if (retriesLeft > 0) {
  //         updateFormStatus(section, retriesLeft - 1);
  //       } else {
  //         throwError(err);
  //       }
  //     });
  // };

  const renderStep = () => {
    switch (step) {
      case 'aadhaar':
        return (
          <VerifyAadharScreen
            defaultValues={aadhaarData ?? undefined}
            onNext={values => {
              firstStepFun(values);
            }}
            api={aadhaarGetOtpApi}
            token={sessionToken}
          />
        );
      case 'otp':
        return (
          <VerifyOtpScreen
            aadhaar={aadhaarData}
            resendOtp={() => verifyAadhaarFun()}
            onNext={() => setStep('details')}
            onChangeAadhaar={() => setStep('aadhaar')}
            api={aadhaarVerifyOtpApi}
            token={sessionToken}
          />
        );
      case 'details':
        return (
          <PersonalDetailsScreen
            // Prefer in-session edits (detailsData); otherwise prefill from the
            // resumed draft mapped back into the form shape.
            defaultValues={detailsData ?? mapDraftToFormValues(draftData)}
            options={masterOptions}
            token={sessionToken}
            aadhaarLast4={
              aadhaarData?.aadhaar_number?.slice(-4) ?? draftData?.aadhaar_last4
            }
            onNext={(values, labels) => {
              setDetailsData(values);
              setDetailsLabels(labels);
              setStep('documents');
            }}
          />
        );
      case 'documents':
        return (
          <DocumentsScreen
            defaultValues={documentsData ?? undefined}
            onNext={values => {
              setDocumentsData(values);
              setStep('preview');
            }}
            onBack={() => setStep('details')}
          />
        );
      case 'preview':
        return detailsData && documentsData ? (
          <PreviewScreen
            details={detailsData}
            labels={detailsLabels}
            documents={documentsData}
            onEditDetails={() => setStep('details')}
            onEditDocuments={() => setStep('documents')}
            onBack={() => setStep('documents')}
            onNext={() => setStep('payment')}
          />
        ) : null;
      case 'payment':
        return (
          <PaymentScreen
            referenceNo={REFERENCE_NO}
            registrationFee={REGISTRATION_FEE}
            convenienceFee={CONVENIENCE_FEE}
            gstPercent={GST_PERCENT}
            loading={paying}
            onPay={handlePay}
            onBack={() => setStep('preview')}
          />
        );
    }
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <Header title={headerTitle} />

      <View style={{ paddingHorizontal: 16 }}>{renderStep()}</View>

      <RegistrationSuccessModal
        visible={successOpen}
        applicationId={APPLICATION_ID}
        paymentId={paymentId ?? PAYMENT_ID}
        dateTime={dateString}
        amount={amountString}
        onGoToDashboard={() => {
          setSuccessOpen(false);
          navigation.navigate('Login');
        }}
        onDownloadReceipt={() => {
          setSuccessOpen(false);
          navigation.navigate('Receipt', { data: receiptData });
        }}
        onShowFailureDemo={() => {
          setSuccessOpen(false);
          setFailedOpen(true);
        }}
      />

      <PaymentFailedModal
        visible={failedOpen}
        onRetry={() => {
          setFailedOpen(false);
          setStep('payment');
        }}
        onBackToForm={() => {
          setFailedOpen(false);
          setStep('details');
        }}
      />
    </View>
  );
}

export default RegisterIndex;
