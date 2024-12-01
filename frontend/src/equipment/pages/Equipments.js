import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EquipmentsTable from '../components/EquipmentTable';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Equipments = () => {
  const [loadedEquipments, setLoadedEquipments] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const token = useParams();
  console.log(token)
  useEffect(() => {
    const fetchEquipments = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/equipments`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        setLoadedEquipments(responseData);
      } catch (err) { }
    };
    fetchEquipments();
  }, [sendRequest, token]);

  const equipmentDeletedHandler = async (deletedEquipmentId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/equipments/${deletedEquipmentId}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        }
      );
      console.log('Equipment deleted:', responseData);
      setLoadedEquipments((prevEquipments) =>
        prevEquipments.filter(equipment => equipment._id !== deletedEquipmentId)
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
      {!isLoading && loadedEquipments && (
        <EquipmentsTable items={loadedEquipments} onEquipmentDelete={equipmentDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Equipments;
