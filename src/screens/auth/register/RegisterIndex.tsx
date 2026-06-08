import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useScrollToTop } from '@/components/layout/ScreenLayout';
import Header from '@/components/Header';
import VerifyAadharScreen from './VerifyAadharScreen';
import VerifyOtpScreen from './VerifyOtpScreen';
import PersonalDetailsScreen from './PersonalDetailsScreen';
import DocumentsScreen from './DocumentsScreen';
import PreviewScreen from './PreviewScreen';
import PaymentScreen from './PaymentScreen';
import RegistrationSuccessModal from './RegistrationSuccessModal';
import PaymentFailedModal from './PaymentFailedModal';

import { payRegistrationFee } from '@/services/payment';

import {
  AadhaarValues,
  DocumentsValues,
  PersonalDetailsValues,
} from './registrationSchemas';

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
  const navigation = useNavigation<any>();
  const scrollToTop = useScrollToTop();
  const [step, setStep] = useState<Step>('aadhaar');
  const [aadhaarData, setAadhaarData] = useState<AadhaarValues | null>(null);
  const [detailsData, setDetailsData] = useState<PersonalDetailsValues | null>(
    null,
  );
  const [documentsData, setDocumentsData] = useState<DocumentsValues | null>(
    null,
  );
  const [successOpen, setSuccessOpen] = useState(false);
  const [failedOpen, setFailedOpen] = useState(false);
  // Razorpay checkout is in flight — drives the Pay button spinner so the user
  // can't double-tap into two checkout sheets.
  const [paying, setPaying] = useState(false);
  // Real payment id from a successful charge; falls back to the placeholder
  // while the backend (which would mint the application id) isn't live.
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Stepping through the wizard swaps content within the SAME route, so the
  // navigator's focus-based scroll reset never fires. Reset the scroll position
  // ourselves on every step change so each step starts at the top.
  useEffect(() => {
    scrollToTop();
  }, [step, scrollToTop]);

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

  const renderStep = () => {
    switch (step) {
      case 'aadhaar':
        return (
          <VerifyAadharScreen
            defaultValues={aadhaarData ?? undefined}
            onNext={values => {
              setAadhaarData(values);
              setStep('otp');
            }}
          />
        );
      case 'otp':
        return (
          <VerifyOtpScreen
            aadhaar={aadhaarData?.aadhaar ?? ''}
            onNext={() => setStep('details')}
            onChangeAadhaar={() => setStep('aadhaar')}
          />
        );
      case 'details':
        return (
          <PersonalDetailsScreen
            defaultValues={detailsData ?? undefined}
            onNext={values => {
              setDetailsData(values);
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
