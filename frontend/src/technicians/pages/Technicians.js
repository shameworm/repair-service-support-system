import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import TechniciansTable from '../components/TechniciansTable';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Technicians = () => {
  const [loadedTechnicians, setLoadedTechnicians] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const token = useParams();
  console.log(token)
  useEffect(() => {
    const fetchTechnicians = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/technicians`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        setLoadedTechnicians(responseData);
      } catch (err) { }
    };
    fetchTechnicians();
  }, [sendRequest, token]);


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTechnicians && (
        <TechniciansTable items={loadedTechnicians} />
      )}
    </React.Fragment>
  );
};

export default Technicians;
