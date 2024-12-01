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
import "./ReportForm.css"

const NewReport = () => {
  const auth = useContext(AuthContext);
  const { isAdmin } = JSON.parse(localStorage.getItem('userData'));
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      date: {
        value: '',
        isValid: false
      },
      type: {
        value: '',
        isValid: false
      },
      details: {
        value: '',
        isValid: false
      },
      maintenanceId: {
        value: '',
        isValid: false,
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
  const [loadedMaintenance, setLoadedMaintenance] = useState([]);
  const [loadedEquipments, setLoadedEquipments] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(auth.userId);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

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
    const fetchMaintenance = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/maintance`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        setLoadedMaintenance(responseData);
      } catch (err) { }
    };
    fetchMaintenance();
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

  const maintenanceOptions = loadedMaintenance.map((maintance) => ({
    value: maintance._id,
    label: maintance.type,
  }));

  const equipmentOptions = loadedEquipments.map((equipment) => ({
    value: equipment._id,
    label: equipment.name,
  }));

  const handleTechnicianChange = (selectedOption) => {
    setSelectedTechnician(selectedOption);
  };

  const handleMaintenanceChange = (selectedOption) => {
    setSelectedMaintenance(selectedOption);
  };

  const handleEquipmentChange = (selectedOption) => {
    setSelectedEquipment(selectedOption);
  };

  const history = useHistory();

  const reportSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/reports',
        'POST',
        JSON.stringify({
          date: formState.inputs.date.value,
          type: formState.inputs.type.value,
          details: formState.inputs.details.value,
          maintenanceId: selectedMaintenance.value,
          equipmentId: selectedEquipment.value,
          technicianId: selectedTechnician.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      history.push('/reports');
    } catch (err) {
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="maintance-form" onSubmit={reportSubmitHandler}>
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
          id="type"
          element="input"
          type="text"
          label="Тип звіту"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть тип обслуговування."
          onInput={inputHandler}
        />
        <Input
          id="details"
          element="textarea"
          type="text"
          label="Деталі"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть деталі."
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

            <label>Виберіть обслуговування:</label>
            <Select
              id="maintenanceId"
              options={maintenanceOptions}
              value={selectedMaintenance}
              onChange={handleMaintenanceChange}
              placeholder="Оберіть обслуговування"
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
            <label>Виберіть обслуговування:</label>
            <Select
              id="maintenanceId"
              options={maintenanceOptions}
              value={selectedMaintenance}
              onChange={handleMaintenanceChange}
              placeholder="Оберіть обслуговування"
            />
          </>
        )}
        <Button type="submit">
          Додати обслуговування
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewReport;
