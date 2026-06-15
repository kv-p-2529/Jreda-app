import { useEffect, useState } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import axios from 'axios';

import authApi from '@/api/authApi';
import throwError from '@/api/throwError';
import { getFullUrl } from '@/services/baseService';
import { mapCodeNameOptions } from '../registrationOptions';
import type { PersonalDetailsValues } from '../registrationSchemas';
import type { SelectOption } from '@/components/ui/form/FormSelect';

// The cascading option lists for both address sections, keyed by the parent
// selection (district → talukas + blocks, taluka → towns/villages).
export type LocationCascade = {
  resTalukas: SelectOption[];
  resVillages: SelectOption[];
  resBlocks: SelectOption[];
  locTalukas: SelectOption[];
  locVillages: SelectOption[];
  locBlocks: SelectOption[];
};

// Location cascade for PersonalDetails. The talukas/towns/blocks endpoints are
// keyed off the parent selection, so we fetch them on change for BOTH address
// sections (residential + location). Response shapes aren't confirmed yet — each
// fetch console.logs the raw body so we can see the real keys, and
// mapCodeNameOptions maps them defensively.
export function useLocationCascade(
  control: Control<PersonalDetailsValues>,
): LocationCascade {
  const { talukasListApi, townsListApi, blocksListApi } = authApi();

  const [resTalukas, setResTalukas] = useState<SelectOption[]>([]);
  const [resVillages, setResVillages] = useState<SelectOption[]>([]);
  const [resBlocks, setResBlocks] = useState<SelectOption[]>([]);
  const [locTalukas, setLocTalukas] = useState<SelectOption[]>([]);
  const [locVillages, setLocVillages] = useState<SelectOption[]>([]);
  const [locBlocks, setLocBlocks] = useState<SelectOption[]>([]);

  // Watch the parent selections that drive the cascade.
  const resDistrict = useWatch({ control, name: 'residential.district' });
  const resTaluka = useWatch({ control, name: 'residential.taluka' });
  const locDistrict = useWatch({ control, name: 'location.district' });
  const locTaluka = useWatch({ control, name: 'location.taluka' });

  // GET talukas for a district_code.
  const fetchTalukas = (districtCode: string) =>
    axios
      .get<any>(getFullUrl(talukasListApi(districtCode)))
      .then(res => {
        console.log('Talukas response →', districtCode, res?.data);
        return mapCodeNameOptions(res?.data?.data, 'taluka_code', 'taluka_name');
      })
      .catch(err => {
        throwError(err);
        return [] as SelectOption[];
      });

  // GET blocks for a district_code.
  const fetchBlocks = (districtCode: string) =>
    axios
      .get<any>(getFullUrl(blocksListApi(districtCode)))
      .then(res => {
        console.log('Blocks response →', districtCode, res?.data);
        return mapCodeNameOptions(res?.data?.data, 'block_code', 'block_name');
      })
      .catch(err => {
        throwError(err);
        return [] as SelectOption[];
      });

  // GET towns (village/city) for a taluka_code.
  const fetchTowns = (talukaCode: string) =>
    axios
      .get<any>(getFullUrl(townsListApi(talukaCode)))
      .then(res => {
        console.log('Towns (village/city) response →', talukaCode, res?.data);
        return mapCodeNameOptions(res?.data?.data, 'town_code', 'town_name');
      })
      .catch(err => {
        throwError(err);
        return [] as SelectOption[];
      });

  // Residential: district change → talukas + blocks.
  useEffect(() => {
    if (!resDistrict) {
      setResTalukas([]);
      setResBlocks([]);
      return;
    }
    fetchTalukas(resDistrict).then(setResTalukas);
    fetchBlocks(resDistrict).then(setResBlocks);
  }, [resDistrict]);

  // Residential: taluka change → towns/villages.
  useEffect(() => {
    if (!resTaluka) {
      setResVillages([]);
      return;
    }
    fetchTowns(resTaluka).then(setResVillages);
  }, [resTaluka]);

  // Location: district change → talukas + blocks.
  useEffect(() => {
    if (!locDistrict) {
      setLocTalukas([]);
      setLocBlocks([]);
      return;
    }
    fetchTalukas(locDistrict).then(setLocTalukas);
    fetchBlocks(locDistrict).then(setLocBlocks);
  }, [locDistrict]);

  // Location: taluka change → towns/villages.
  useEffect(() => {
    if (!locTaluka) {
      setLocVillages([]);
      return;
    }
    fetchTowns(locTaluka).then(setLocVillages);
  }, [locTaluka]);

  return {
    resTalukas,
    resVillages,
    resBlocks,
    locTalukas,
    locVillages,
    locBlocks,
  };
}
