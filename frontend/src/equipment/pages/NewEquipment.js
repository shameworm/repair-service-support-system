import React, { useContext } from 'react';
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

const NewEquipment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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
      }
    },
    false
  );

  const history = useHistory();

  const equipmentSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/equipments',
        'POST',
        JSON.stringify({
          name: formState.inputs.name.value,
          type: formState.inputs.type.value,
          status: formState.inputs.status.value,
          location: formState.inputs.location.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token

        }
      )
      history.push('/equipments');
    } catch (err) {
    }
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="equipment-form" onSubmit={equipmentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          element="input"
          type="text"
          label="Назва"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть коректну назву."
          onInput={inputHandler}
        />
        <Input
          element="input"
          label="Тип"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть коректний тип"
          onInput={inputHandler}
        />
        <Input
          element="input"
          label="Статус"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Будь ласка, введіть коректний статус."
          onInput={inputHandler}
        />
        <Input
          element="input"
          label="Адреса"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Будь ласка, введіть коректний адрес."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Додати обладнання
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewEquipment;
