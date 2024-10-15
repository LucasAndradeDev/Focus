async function CreateUser(formData: FormData) {
 "use server";

 const firstName = formData.get("name");
 const lastName = formData.get("lastName");
 const email = formData.get("email");
 const password = formData.get("password");
}