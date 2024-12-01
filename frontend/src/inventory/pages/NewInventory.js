import React, { useContext, useEffect, useState } from 'react';
import Select from "react-select";
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewInventory = () => {
  const auth = useContext(AuthContext);
  const { isAdmin } = JSON.parse(localStorage.getItem('userData'));
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      date: {
        value: '',
        isValid: false
      },
      remarks: {
        value: '',
        isValid: false
      },
      equipmentId: {
        value: '',
        isValid: false
      },
      technicianId: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const [loadedTechnicians, setLoadedTechnicians] = useState([]);
  const [loadedEquipments, setLoadedEquipments] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(auth.userId);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

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
  }, [sendRequest]);

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
  }, [sendRequest]);


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


  const history = useHistory();

  const equipmentSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState)
    try {
      await sendRequest(
        'http://localhost:5000/api/inventory',
        'POST',
        JSON.stringify({
          date: formState.inputs.date.value,
          remarks: formState.inputs.remarks.value,
          equipmentId: selectedEquipment.value,
          technicianId: selectedTechnician.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      history.push('/inventory');
    } catch (err) {
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="equipment-form" onSubmit={equipmentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="date"
          element="input"
          type="text"
          label="Дата"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть коректну дату."
          onInput={inputHandler}
        />
        <Input
          id="remarks"
          element="textarea"
          label="Зауваження"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть коректні зауваження"
          onInput={inputHandler}
        />
        {isAdmin ? (
          <>
            {/* Селектор для вибору техніка */}
            <label>Виберіть техніка:</label>
            <Select
              id="technicianId"
              options={technicianOptions}
              value={selectedTechnician}
              onChange={handleTechnicianChange}
              placeholder="Оберіть техніка"
            />

            {/* Селектор для вибору обладнання */}
            <label>Виберіть обладнання:</label>
            <Select
              id="equipmentId"
              options={equipmentOptions}
              value={selectedEquipment}
              onChange={handleEquipmentChange}
              placeholder="Оберіть обладнання"
            />
          </>
        ) : (
          <>
            <label>Виберіть обладнання:</label>
            <Select
              id="equipmentId"
              options={equipmentOptions}
              value={selectedEquipment}
              onChange={handleEquipmentChange}
              placeholder="Оберіть обладнання"
            />
          </>
        )}
        <Button type="submit">
          Додати обладнання
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewInventory;
