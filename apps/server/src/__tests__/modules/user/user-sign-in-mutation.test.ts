import { describe, it, expect } from '@jest/globals';
import request from 'supertest-graphql';
import { gql } from '../../setup/utils/gql';
import { getTestUsers } from '../../setup/fixtures/users';
import { generateUniqueIntId } from '../../setup/utils/generateUniqueIntId';
import { setupTestApp } from '../../setup/utils/setupTestApp';

describe('UserSignInMutation', () => {
  it('should sign in a user successfully with correct credentials', async () => {
    const users = await getTestUsers();
    const existingUser = users[0];

    const mutation = gql`
      mutation UserSignInMutation($input: UserSignInMutationInput!) {
        userSignIn(input: $input) {
          success
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
        }
      }
    `;

    const variables = {
      input: {
        email: existingUser.email,
        password: 'password123', // This should match the password in the fixture
        clientMutationId: `test-${generateUniqueIntId()}`,
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect(result.errors).toBeUndefined();
    expect((result.data as any)?.userSignIn.success).toBe('Sign In successful');
    expect((result.data as any)?.userSignIn.token).toBeTruthy();
    expect((result.data as any)?.userSignIn.me.email).toBe(existingUser.email);
  });

  it('should return error when user is not found', async () => {
    const mutation = gql`
      mutation UserSignInMutation($input: UserSignInMutationInput!) {
        userSignIn(input: $input) {
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
        email: 'nonexistent@example.com',
        password: 'anyPassword',
        clientMutationId: `test-${generateUniqueIntId()}`,
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect(result.errors).toBeUndefined();
    expect((result.data as any)?.userSignIn.success).toBe('false');
    expect((result.data as any)?.userSignIn.error.field).toBe('email');
    expect((result.data as any)?.userSignIn.error.message).toBe(
      'User not found'
    );
  });

  it('should return error when password is incorrect', async () => {
    const users = await getTestUsers();
    const existingUser = users[0];

    const mutation = gql`
      mutation UserSignInMutation($input: UserSignInMutationInput!) {
        userSignIn(input: $input) {
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
        email: existingUser.email,
        password: 'wrongPassword',
        clientMutationId: `test-${generateUniqueIntId()}`,
      },
    };

    const app = await setupTestApp();
    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .end();

    expect(result.errors).toBeUndefined();
    expect((result.data as any)?.userSignIn.success).toBe('false');
    expect((result.data as any)?.userSignIn.error.field).toBe('password');
    expect((result.data as any)?.userSignIn.error.message).toBe(
      'Wrong password'
    );
  });
});
