import { useParams } from 'react-router-dom';

export function useDefaultParams<T extends Record<string, string> = {}>(data?: T) {
    const params = useParams<T>();
    return data ?? params;
}
