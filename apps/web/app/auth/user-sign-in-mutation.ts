import { graphql } from 'relay-runtime';
import { commitMutation } from 'react-relay';
import type { Environment } from 'relay-runtime';
import type {
  userSignInMutation as UserSignInMutationType,
  userSignInMutation$data,
} from '~/__generated__/userSignInMutation.graphql';

const mutation = graphql`
  mutation userSignInMutation($input: UserSignInMutationInput!) {
    userSignIn(input: $input) {
      token
      me {
        id
        name
        email
      }
      error {
        field
        message
      }
      success
    }
  }
`;

export function commitUserSignInMutation(
  environment: Environment,
  email: string,
  password: string
): Promise<userSignInMutation$data> {
  const variables = {
    input: {
      email,
      password,
      clientMutationId: '',
    },
  };

  return new Promise((resolve, reject) => {
    commitMutation<UserSignInMutationType>(environment, {
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
