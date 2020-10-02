import axios from 'axios'

export default async (singleForm, values, lambdaEndpoint) => {
    const formData = new FormData();
        for (const attribute in values) {
            if (values.hasOwnProperty(attribute)) {
                let value = values[attribute];
                if (attribute === 'input_2') {
                    value = value[0]
                }
                formData.append(attribute, value);
            }
        }

    let result

    try {
        result = await axios.post(`${singleForm.apiURL}/submissions`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.log(error);

    const errorResponse = error.response.data;

    // Here we know this is a Gravity Form Error
    if (errorResponse.is_valid === false) {
      return {
        status: 'error',
        data: JSON.stringify({
          status: 'gravityFormErrors',
          message: 'Gravity Forms has flagged issues',
          validation_messages: errorResponse.validation_messages,
        }),
      };
    } else {
      // Unknown error
      return {
        status: 'error',
        data: JSON.stringify({
          status: 'unknown',
          message: 'Something went wrong',
        }),
      };
    }
    }

    return {
        status: 'success',
        data: result,
    }
}
