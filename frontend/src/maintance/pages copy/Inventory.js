import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import InventoryTable from '../components/MaintanceTable';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Inventory = () => {
  const [loadedInventory, setLoadedInventory] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const token = useParams();
  useEffect(() => {
    const fetchInventory = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/inventory/`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        console.log(responseData)
        setLoadedInventory(responseData);
      } catch (err) { }
    };
    fetchInventory();
  }, [sendRequest, token]);

  const inventoryDeletedHandler = async (deletedInvetoryId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/inventory/${deletedInvetoryId}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        }
      );
      console.log('Inventory deleted:', responseData);
      setLoadedInventory((prevInventory) =>
        prevInventory.filter(inventory => inventory._id !== deletedInvetoryId)
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
      {!isLoading && loadedInventory && (
        <InventoryTable items={loadedInventory} onInventoryDelete={inventoryDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Inventory;
