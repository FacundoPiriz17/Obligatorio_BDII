import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const run = useCallback(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        Promise.resolve(fetcher())
            .then((d) => {
                if (!cancelled) setData(d);
            })
            .catch((e) => {
                if (!cancelled) setError(e);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [fetcher]);

    useEffect(() => run(), [run]);

    return { data, loading, error, refetch: run };
}
