import { useEffect, useState } from 'react';
import useDataProvider from './useDataProvider';

export type QueryParams = {
  api: string
  options: any
  formatResult?: (res: any) => any
  onSuccess?: (data: any, params: any) => void
  onError?: (error: any, params: any) => void
}

export const useQuery = function <T>({ api, options, formatResult = (res) => res, onSuccess, onError }: QueryParams): {
  data: any,
  loading: boolean,
  error: any
} {
  const dataProvider = useDataProvider(api);
  if (dataProvider === undefined) {
    throw new Error('No dataProvider found!')
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [data, setData] = useState<T>();
  useEffect(() => {
    setLoading(true)
    dataProvider(options).then((data: any) => {
      const result = typeof formatResult === 'function' ? formatResult(data) : data;
      setData(result)
      onSuccess && onSuccess(data, options)
    }).catch(err => {
      setError(err);
      onError && onError(err, options)
    }).finally(() => {
      setLoading(false)
    })
    // todo cancelable
    // return () => {

    // }
  }, [dataProvider, api, onError, onSuccess, options, formatResult])
  return {
    loading, data, error
  }
}
