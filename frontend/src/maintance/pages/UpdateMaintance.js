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
import "./MaintanceForm.css"

const UpdateMaintance = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMaintance, setLoadedMaintance] = useState();
  const maintanceId = useParams().id;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      date: {
        value: '',
        isValid: false
      },
      type: {
        value: '',
        isValid: false
      },
      status: {
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

  const [loadedEquipments, setLoadedEquipments] = useState([]);
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


  const equipmentOptions = loadedEquipments.map((equipment) => ({
    value: equipment._id,
    label: equipment.name,
  }));


  const handleEquipmentChange = (selectedOption) => {
    setSelectedEquipment(selectedOption);
  };
  console.log(maintanceId)
  // Fetch existing maintance data
  useEffect(() => {
    const fetchMaintance = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/maintance/${maintanceId}`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedMaintance(responseData);
        setFormData(
          {
            date: {
              value: responseData.date,
              isValid: true
            },
            type: {
              value: responseData.type,
              isValid: true
            },
            status: {
              value: responseData.status,
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
        setSelectedEquipment({ value: responseData.equipmentId, label: responseData.equipmentName });
      } catch (err) { }
    };
    fetchMaintance();
  }, [sendRequest, maintanceId, auth.token, setFormData]);

  const maintanceUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/maintance/${maintanceId}`,
        'PUT',
        JSON.stringify({
          date: formState.inputs.date.value,
          type: formState.inputs.type.value,
          status: formState.inputs.status.value,
          equipmentId: selectedEquipment.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/maintance');
    } catch (err) { }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedMaintance && !error) {
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
      {!isLoading && loadedMaintance && (
        <form className="maintance-form" onSubmit={maintanceUpdateSubmitHandler}>
          <Input
            id="date"
            element="input"
            type="text"
            label="Дата"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректну дату."
            onInput={inputHandler}
            initialValue={loadedMaintance.date}
            initialValid={true}
          />
          <Input
            id="type"
            element="input"
            label="Тип"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректні зауваження."
            onInput={inputHandler}
            initialValue={loadedMaintance.remarks}
            initialValid={true}
          />
          <Input
            id="status"
            element="input"
            label="Статус"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректні зауваження."
            onInput={inputHandler}
            initialValue={loadedMaintance.remarks}
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

export default UpdateMaintance;
