import { useState, useEffect } from 'react';
import { getAffiliatesToPayment, getDebtAffiliate, getPaymentAffiliate, postPayDebt } from '../services/paymentService';
import { mapDebtData } from '../mapper/debtMapper';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../store/iuSlice';

export const usePayment = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.ui.globalLoading);

    const [affiliates, setAffiliates] = useState(null);
    const [selectedAffiliatePayment, setSelectedAffiliatePayment] = useState(null);
    const [selectedAffiliateDebt, setSelectedAffiliateDebt] = useState(null);

    const [loadingAffiliates, setLoadingAffiliates] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [loadingDebp, setLoadingDebp] = useState(false);

    const [loadingUpdateResponse, setLoadingUpdateResponse] = useState(false);
    const [error, setError] = useState(null);

    const fetchAffiliatesToPayment = async () => {
        try {
            setLoadingAffiliates(true);
            dispatch(setLoading(true));
            const dto = await getAffiliatesToPayment();
            setAffiliates(dto);
        } catch (err) {
            setError(err);
        } finally {
            setLoadingAffiliates(false);
            dispatch(setLoading(false));
        }
    };

    const getPaymentByAffiliate = async (id) => {
        try {
            setLoadingPayment(true);
            const dto = await getPaymentAffiliate(id);
            setSelectedAffiliatePayment(dto);
        } catch (err) {
            setError(err);
        } finally {
            setLoadingPayment(false);
        }
    };
    const getDebByAffiliate = async (id) => {
        try {
            setLoadingPayment(true);
            const dto = await getDebtAffiliate(id);
            const newdata = mapDebtData(dto)
            setSelectedAffiliateDebt(newdata);
        } catch (err) {
            setError(err);
        } finally {
            setLoadingDebp(false);
        }
    };
    const updatePaymentAffiliate = async (id, data) => {
        try {
            setLoadingUpdateResponse(true);
            const response = await postPayDebt(id, data);

            return response;

        } catch (err) {
            setError(err);
        } finally {
            setLoadingDebp(false);
        }
    };




    useEffect(() => {
        fetchAffiliatesToPayment();
    }, []);

    return {
        affiliates,
        selectedAffiliatePayment,
        loadingAffiliates,
        loadingPayment,
        error,
        getPaymentByAffiliate, getDebByAffiliate
        , loadingDebp, selectedAffiliateDebt, updatePaymentAffiliate, loadingUpdateResponse,loading 
    };
};
