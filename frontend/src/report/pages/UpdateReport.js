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
import "./ReportForm.css"

const UpdateReport = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReport, setLoadedReport] = useState();
  const reportId = useParams().id;
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
      details: {
        value: '',
        isValid: false
      },
      maintenanceId: {
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
  const [loadedMaintances, setLoadedMaintances] = useState([]);
  const [selectedMaintance, setSelectedMaintance] = useState(null);


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
    const fetchMaintances = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/maintance`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedMaintances(responseData);
      } catch (err) { }
    };
    fetchMaintances();
  }, [sendRequest, auth.token]);


  const equipmentOptions = loadedEquipments.map((equipment) => ({
    value: equipment._id,
    label: equipment.name,
  }));

  const maintanceOptions = loadedMaintances.map((maintance) => ({
    value: maintance._id,
    label: maintance.type,
  }));


  const handleEquipmentChange = (selectedOption) => {
    setSelectedEquipment(selectedOption);
  };

  const handleMaintanceChange = (selectedOption) => {
    setSelectedMaintance(selectedOption);
  };
  console.log(reportId)
  // Fetch existing report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/reports/${reportId}`,
          "GET",
          null,
          { Authorization: `Bearer ${auth.token}` }
        );
        setLoadedReport(responseData);
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
            details: {
              value: responseData.details,
              isValid: true
            },
            maintenanceId: {
              value: responseData.maintenanceId,
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
    fetchReport();
  }, [sendRequest, reportId, auth.token, setFormData]);

  const reportUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/reports/${reportId}`,
        'PUT',
        JSON.stringify({
          date: formState.inputs.date.value,
          type: formState.inputs.type.value,
          details: formState.inputs.details.value,
          equipmentId: selectedEquipment.value,
          maintenanceId: selectedMaintance.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/report');
    } catch (err) { }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedReport && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Не вдалось знайти звіт!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedReport && (
        <form className="report-form" onSubmit={reportUpdateSubmitHandler}>
          <Input
            id="date"
            element="input"
            type="text"
            label="Дата"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректну дату."
            onInput={inputHandler}
            initialValue={loadedReport.date}
            initialValid={true}
          />
          <Input
            id="type"
            element="input"
            label="Тип"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректні зауваження."
            onInput={inputHandler}
            initialValue={loadedReport.remarks}
            initialValid={true}
          />
          <Input
            id="details"
            element="textarea"
            label="Деталі"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Будь ласка, введіть коректні зауваження."
            onInput={inputHandler}
            initialValue={loadedReport.remarks}
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
          <label>Виберіть обслуговування:</label>
          <Select
            id="maintenanceId"
            options={maintanceOptions}
            value={selectedMaintance}
            onChange={handleMaintanceChange}
            placeholder="Оберіть обслуговування"
          />
          <Button type="submit" disabled={!formState.isValid}>
            Оновити інвентар
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateReport;
