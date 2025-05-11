import { graphql } from 'relay-runtime';
import { commitMutation } from 'react-relay';
import type { Environment } from 'relay-runtime';
import type {
  userSignUpMutation as UserSignUpMutationType,
  userSignUpMutation$data,
} from '~/__generated__/userSignUpMutation.graphql';

const mutation = graphql`
  mutation userSignUpMutation($input: UserSignUpMutationInput!) {
    userSignUp(input: $input) {
      token
      me {
        id
        name
        email
      }
      account {
        id
        accountName
        balance
      }
      error {
        field
        message
      }
      success
    }
  }
`;

export function commitUserSignUpMutation(
  environment: Environment,
  name: string,
  email: string,
  password: string
): Promise<userSignUpMutation$data> {
  const variables = {
    input: {
      name,
      email,
      password,
      clientMutationId: '',
    },
  };

  return new Promise((resolve, reject) => {
    commitMutation<UserSignUpMutationType>(environment, {
      mutation,
      variables,
      onCompleted: (response, errors) => {
        if (errors) {
          return reject(errors);
        }
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}
