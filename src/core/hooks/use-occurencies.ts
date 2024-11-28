import React from 'react';

import { FogoCruzadoOccurrences } from '@/api/types';
import { getOccurrencesByCityAndState } from '@/api/fogo-cruzado';

export type GetOccurrencesProps = {
  stateId: string;
  cityId?: string;
};

function useOccurencies() {
  const [occurencies, setOccurencies] = React.useState<
    FogoCruzadoOccurrences['data']
  >([]);

  const [isOccurenciesLoading, setIsOccurenciesLoading] = React.useState(false);

  async function getOccurrences({ stateId, cityId }: GetOccurrencesProps) {
    setIsOccurenciesLoading(true);

    const { data: response } = await getOccurrencesByCityAndState({
      stateId,
      cityId
    });

    setOccurencies(response.data);

    setIsOccurenciesLoading(false);

    return response.data;
  }

  return {
    occurencies,
    getOccurrences,
    isOccurenciesLoading
  };
}

export default useOccurencies;
