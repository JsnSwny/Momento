import { 
  REFRESH_TOKEN, 
  LOGIN_SUCCESS, 
  LOGOUT, 
  REGISTER_SUCCESS 
} from "../store/actions/types";
import auth from "../store/reducers/auth";

test('auth test: should return the initial state (user not logged in)', () => {
  expect(auth(undefined, {})).toEqual({
      isLoggedIn: false,
      user: null
    }
  )
})

test('auth test: user registering', () => {
  const action = { type: REGISTER_SUCCESS }
  expect(auth(undefined, action)).toEqual({
    isLoggedIn: false,
    successful: true,
    user: null
  })
})

test('auth test: user logging in', () => {
  const action = { type: LOGIN_SUCCESS, payload: { 
      user: { 
        username: "test",
        id: 7357
      } 
    } 
}
  expect(auth(undefined, action)).toEqual({
    isLoggedIn: true,
    user: {
      username: "test",
      id: 7357
    }
  })
})

test('auth test: user logging out', () => {
  const action = { type: LOGOUT }
  const previousState = {
    isLoggedIn: true,
    user: {
      username: "test",
      id: 7357
    }
  }
  expect(auth(previousState, action)).toEqual({
    isLoggedIn: false,
    user: null
  })
})

test('auth test: access token refreshed', () => {
  const action = { type: REFRESH_TOKEN, payload: "new-jwt-token"}
  const previousState = {
    isLoggedIn: true,
    user: {
      accessToken: "expired-jwt-token"
    }
  }
  expect(auth(previousState, action)).toEqual({
    isLoggedIn: true,
    user: {
      accessToken: "new-jwt-token"
    }
  })
})