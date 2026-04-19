async function  loadStudents(){
    try{
        const response = await fetch ('http://localhost:8080/api/students');
        const result = await response.json();

        if (result.status === "success") {
            console.log("Data recieved:", result.data)
            // will put some code later document.getElementByID
        }
    }   catch (error) {
        console.error("Integration Error:", error);
    }
}