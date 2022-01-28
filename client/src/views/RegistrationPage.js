
// import profile from "./image/a.svg";
// import email from "./image/email.svg";
// import pass from "./image/pass.svg";
function App() {
  return (
    <div className="LoginRegistration">
      <div className="sub-main">
        <div>
          <div className="imgs">
            <div className="container-image">
            <i class="far fa-user"></i>
            </div>
          </div>

          <div>
            <div className="title">
            <h1>Momento Registration</h1>
            </div>
            <div className="Username">
            <i class="fas fa-user"></i>
              <input type="text" placeholder="Username" className="name"/>
            </div>

            <div className="FirstName">
            <i class="fas fa-user"></i>
              <input type="text" placeholder="First Name" className="name"/>
            </div>

            <div className="LastName">
            <i class="fas fa-user"></i>
              <input type="text" placeholder="Last Name" className="name"/>
            </div>

            <div className="email">
            <i class="fas fa-envelope"></i>
              <input type="text" placeholder="Email" className="name"/>
            </div>
          

            <div className="password">
            <i class="fas fa-lock"></i>
              <input type="password" placeholder="Password" className="name"/>
            </div>

            <div className="confirmPassword">
            <i class="fas fa-lock"></i>
              <input type="password" placeholder="Confirm Password" className="name"/>
            </div>

            <div className="loginRegister-button">
            <button>Register</button>
          </div>

          
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;