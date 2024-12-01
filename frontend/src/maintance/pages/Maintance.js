import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MaintanceTable from '../components/MaintanceTable';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Maintance = () => {
  const [loadedMaintance, setLoadedMaintance] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const token = useParams();
  useEffect(() => {
    const fetchMaintance = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/maintance/`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        setLoadedMaintance(responseData);
      } catch (err) { }
    };
    fetchMaintance();
  }, [sendRequest, token]);

  const maintanceDeletedHandler = async (deletedInvetoryId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/maintance/${deletedInvetoryId}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        }
      );
      console.log('Maintance deleted:', responseData);
      setLoadedMaintance((prevMaintance) =>
        prevMaintance.filter(maintance => maintance._id !== deletedInvetoryId)
      );
    } catch (err) {
      console.log('Error deleting equipment:', err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedMaintance && (
        <MaintanceTable items={loadedMaintance} onMaintanceDelete={maintanceDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Maintance;
