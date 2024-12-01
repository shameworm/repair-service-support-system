import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Select from "react-select";
import "./InventoryForm.css"

const UpdateInventory = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedInventory, setLoadedInventory] = useState();
  const inventoryId = useParams()._id;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      date: {
        value: '',
        isValid: false
      },
      remarks: {
        value: '',
        isValid: false
      },
      technicianId: {
        value: '',
        isValid: false
      },
      equipmentId: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const [loadedTechnicians, setLoadedTechnicians] = useState([]);
  const [loadedEquipments, setLoadedEquipments] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Fetch equipment and technician data
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/equipments`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedEquipments(responseData);
      } catch (err) { }
    };
    fetchEquipments();
  }, [sendRequest, auth.token]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/technicians`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedTechnicians(responseData);
      } catch (err) { }
    };
    fetchTechnicians();
  }, [sendRequest, auth.token]);

  // Technician and equipment options for select dropdowns
  const technicianOptions = loadedTechnicians.map((technician) => ({
    value: technician._id,
    label: technician.name,
  }));

  const equipmentOptions = loadedEquipments.map((equipment) => ({
    value: equipment._id,
    label: equipment.name,
  }));

  const handleTechnicianChange = (selectedOption) => {
    setSelectedTechnician(selectedOption);
  };

  const handleEquipmentChange = (selectedOption) => {
    setSelectedEquipment(selectedOption);
  };
  console.log(inventoryId)
  // Fetch existing inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/inventory/${inventoryId}`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedInventory(responseData);
        setFormData(
          {
            date: {
              value: responseData.date,
              isValid: true
            },
            remarks: {
              value: responseData.remarks,
              isValid: true
            },
            technicianId: {
              value: responseData.technicianId,
              isValid: true
            },
            equipmentId: {
              value: responseData.equipmentId,
              isValid: true
            }
          },
          true
        );
        setSelectedTechnician({ value: responseData.technicianId, label: responseData.technicianName });
        setSelectedEquipment({ value: responseData.equipmentId, label: responseData.equipmentName });
      } catch (err) { }
    };
    fetchInventory();
  }, [sendRequest, inventoryId, auth.token, setFormData]);

  // Submit updated inventory
  const inventoryUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/inventory/${inventoryId}`,
        'PUT',
        JSON.stringify({
          date: formState.inputs.date.value,
          remarks: formState.inputs.remarks.value,
          equipmentId: selectedEquipment.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/inventory');
    } catch (err) { }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedInventory && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Не вдалось знайти інвентар!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedInventory && (
        <form className="inventory-form" onSubmit={inventoryUpdateSubmitHandler}>
          <Input
            id="date"
            element="input"
            type="text"
            label="Дата"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректну дату."
            onInput={inputHandler}
            initialValue={loadedInventory.date}
            initialValid={true}
          />
          <Input
            id="remarks"
            element="textarea"
            label="Зауваження"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректні зауваження."
            onInput={inputHandler}
            initialValue={loadedInventory.remarks}
            initialValid={true}
          />
          <label>Виберіть обладнання:</label>
          <Select
            id="equipmentId"
            options={equipmentOptions}
            value={selectedEquipment}
            onChange={handleEquipmentChange}
            placeholder="Оберіть обладнання"
          />
          <Button type="submit" disabled={!formState.isValid}>
            Оновити інвентар
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateInventory;
