import { describe, it, expect } from '@jest/globals';
import { gql } from '../../setup/utils/gql.ts';
import { getTestUsers } from '../../setup/fixtures/users.ts';
import { generateUniqueIntId } from '../../setup/utils/generateUniqueIntId.ts';
import request from 'supertest-graphql';
import { setupTestApp } from '../../setup/utils/setupTestApp.ts';

describe('UserSignUpMutation', () => {
  it('should create a new user and account successfully', async () => {
    const mutation = gql`
      mutation UserSignUpMutation($input: UserSignUpMutationInput!) {
        userSignUp(input: $input) {
          success
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
        }
      }
    `;

    const variables = {
      input: {
        name: 'test1',
        email: `newuser-${generateUniqueIntId()}@example.com`,
        password: 'strongPassword123',
        clientMutationId: '1',
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect((result.data as any)?.userSignUp.success).toBe(
      'User successfully signed up'
    );

    expect((result.data as any)?.userSignUp.token).toBeTruthy();
    expect((result.data as any)?.userSignUp.me.name).toBe('test1');
    expect((result.data as any)?.userSignUp.me.email).toBe(
      variables.input.email
    );
    expect((result.data as any)?.userSignUp.account).toBeTruthy();
    expect((result.data as any)?.userSignUp.account.balance).toBe('0');
  });

  it('should return error when email is already in use', async () => {
    // First create a test user
    const users = await getTestUsers();
    const existingUser = users[0];

    const mutation = gql`
      mutation UserSignUpMutation($input: UserSignUpMutationInput!) {
        userSignUp(input: $input) {
          success
          token
          me {
            id
          }
          error {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        name: 'Test second user',
        email: existingUser.email,
        password: 'strongPassword123',
        clientMutationId: '1',
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect((result.data as any)?.userSignUp.success).toBe('false');
    expect((result.data as any)?.userSignUp.error.field).toBe('email');
    expect((result.data as any)?.userSignUp.error.message).toBe(
      'Email already in use'
    );
  });

  it('should return error when input validation fails', async () => {
    const mutation = gql`
      mutation UserSignUpMutation($input: UserSignUpMutationInput!) {
        userSignUp(input: $input) {
          success
          token
          me {
            id
          }
          error {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        name: 'Invalid-User',
        email: 'invalid-email',
        password: '123',
        clientMutationId: '1',
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect((result.data as any)?.userSignUp.success).toBe('false');
    expect((result.data as any)?.userSignUp.error).toBeTruthy();
  });
});
