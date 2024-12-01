import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import "./EquipmentForm.css"

const UpdateEquipment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEquipment, setLoadedEquipment] = useState();
  const equipmentId = useParams().id
  const history = useHistory();
  console.log(equipmentId)

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
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
      location: {
        value: '',
        isValid: false
      },
    },
    false
  );

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/equipments/${equipmentId}`,
          "GET",
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedEquipment(responseData);
        console.log(responseData.name)
        setFormData(
          {
            name: {
              value: responseData.name,
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
            location: {
              value: responseData.location,
              isValid: true
            }
          },
          true
        );
      } catch (err) { }
    };
    fetchEquipment();
  }, [sendRequest, equipmentId, setFormData, auth.token]);

  const EquipmentUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/equipments/${equipmentId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          type: formState.inputs.type.value,
          status: formState.inputs.status.value,
          location: formState.inputs.location.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/equipments');
    } catch (err) { }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedEquipment && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Не вдалось знайти обладнання!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedEquipment && (
        <form className="equipment-form" onSubmit={EquipmentUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Назва"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Введіть коректні дані."
            onInput={inputHandler}
            initialValue={loadedEquipment.name}
            initialValid={true}
          />
          <Input
            id="type"
            element="input"
            type="text"
            label="Тип"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Введіть коректні дані."
            onInput={inputHandler}
            initialValue={loadedEquipment.type}
            initialValid={true}
          />
          <Input
            id="status"
            element="input"
            type="text"
            label="Статус"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Введіть коректні дані."
            onInput={inputHandler}
            initialValue={loadedEquipment.status}
            initialValid={true}
          />
          <Input
            id="description"
            element="input"
            label="Адреса"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Введіть коректні дані."
            onInput={inputHandler}
            initialValue={loadedEquipment.location}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Оновити обладнання
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateEquipment;
