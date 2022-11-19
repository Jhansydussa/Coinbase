const closeDetailsModal = () => {
  $("#detailsContainer").hide();
  $("#editContainer").hide();
  $("#newContainer").hide();
};

const validateAndShowErrorsOnNew = (obj) => {
  const { Name, Email, Password, confirmPassword } = obj;
  if (!Name) {
    const errorSpan = document.getElementById("usernameErrorSpan");
    errorSpan.innerHTML = "Name is Required!!";
  }
  if (!Email) {
    const errorSpan = document.getElementById("emailErrorSpan");
    errorSpan.innerHTML = "Email is Required!!";
  }
  if (!Password) {
    const errorSpan = document.getElementById("passwordErrorSpan");
    errorSpan.innerHTML = "Password is Required!!";
  }
  if (!confirmPassword) {
    const errorSpan = document.getElementById("confirmpassword");
    errorSpan.innerHTML = "Confirm password is Required!!";
  }
  const isSamePasswords = Password === confirmPassword;
  if (!isSamePasswords) {
    const errorSpan = document.getElementById("editConfirmPasswordErrorSpan");
    errorSpan.innerHTML = "Password should be matched!!";
  }
  return Name && Email && Password && confirmPassword && isSamePasswords;
};


const validateAndShowErrorsOnEdit = (obj) => {
  const { Name, Email, Password, confirmPassword } = obj;
  if (!Name) {
    const errorSpan = document.getElementById("editNameErrorSpan");
    errorSpan.innerHTML = "Name is Required!!";
  }
  if (!Password) {
    const errorSpan = document.getElementById("editPasswordErrorSpan");
    errorSpan.innerHTML = "Password is Required!!";
  }
  if (!confirmPassword) {
    const errorSpan = document.getElementById("editConfirmPasswordErrorSpan");
    errorSpan.innerHTML = "Confirm password is Required!!";
  }
  const isSamePasswords = Password === confirmPassword;
  if (!isSamePasswords) {
    const errorSpan = document.getElementById("editConfirmPasswordErrorSpan");
    errorSpan.innerHTML = "Password should be matched!!";
  }
  return Name && Password && confirmPassword && isSamePasswords;
};


$(function () {
  $.ajax({
    method: "get",
    url: "http://localhost:8080/users",
    success: (data) => {
      $.each(data, (key, value) => {
        let newValue = value.Email;
        $(`<tr>
                            <td>${value.Name}</td>
                            <td>${value.Email}</td>
                            <td><button id="btnDetails" value=${newValue} class="btn btn-success"> <span class="bi bi-eye-fill"></span> </button></td>
                            <td><button id="btnEdit" value=${newValue} class="btn btn-warning"> <span class="bi bi-pen"></span> </button></td>
                            <td><button id="btnDelete" value=${newValue} class="btn btn-danger"> <span class="bi bi-trash"></span> </button></td>
                           </tr>`).appendTo("tbody");
      });
    },
  });

  $("#detailsContainer").hide();
  $("#editContainer").hide();
  $("#newContainer").hide();

  // Details Click
  $(document).on("click", "#btnDetails", (e) => {
    $("#detailsContainer").show();
    $("#editContainer").hide();
    $("#newContainer").hide();
    $.ajax({
      method: "get",
      url: `http://localhost:8080/userDetails/${e.target.value}`,
      success: (data) => {
        $("#userNameDisplay").html(data.Name);
        $("#emailDisplay").html(data.Email);
      },
    });
  });

  // New Click
  $("#btnNew").click(() => {
    $("#detailsContainer").hide();
    $("#newContainer").show();
  });

  // Add Click
  $("#btnAdd").click(() => {
    const Name = document.getElementById("username")?.value;
    const Email = document.getElementById("email")?.value;
    const Password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmpassword")?.value;
    const userObj = {
      Name,
      Email,
      Password,
      confirmPassword,
    };
    const isvalid = validateAndShowErrorsOnNew(userObj);
    if (isvalid) {
      $.ajax({
        method: "post",
        url: "http://localhost:8080/addUser",
        data: userObj,
        success: () => {
          $("#editContainer").hide();
          $("#detailsContainer").hide();
          $("#newContainer").hide();
          location.reload();
        },
      });
    }
  });

  // Delete Click
  $(document).on("click", "#btnDelete", (e) => {
    $.ajax({
      method: "delete",
      url: `http://localhost:8080/deleteUser/${e.currentTarget.value}`,
      success: () => {
        alert("User has been Deleted!!");
        location.reload();
      },
    });
  });

  // Edit Click
  $(document).on("click", "#btnEdit", (e) => {
    $("#editContainer").show();
    $("#detailsContainer").hide();
    $("#newContainer").hide();
    $.ajax({
      method: "get",
      url: `http://localhost:8080/userDetails/${e.currentTarget.value}`,
      success: (data) => {
        $("#editName").val(data.Name);
        $("#editEmail").val(data.Email);
      },
    });
  });
  // Update Click
  $("#btnUpdate").click(() => {
    const Name = document.getElementById("editName")?.value;
    const Email = document.getElementById("editEmail")?.value;
    const Password = document.getElementById("editPassword")?.value;
    const confirmPassword = document.getElementById(
      "editConfirmPassword"
    )?.value;
    const userObj = {
      Name,
      Email,
      Password,
      confirmPassword,
    };
    const isValid = validateAndShowErrorsOnEdit(userObj);
    if (isValid) {
      $.ajax({
        method: "put",
        url: `http://localhost:8080/updateUser/${Email}`,
        data: userObj,
        success: () => {
          this.location.reload();
        },
      });
    }
  });
});
