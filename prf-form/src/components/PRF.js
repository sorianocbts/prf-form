import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import useForm from "../helpers/useForm"
import { testsDataES, testsDataEN } from '../testsData'

const PRF = () => {

//added 08/19/2024
const [language, setLanguage] = useState('en');

const [testsData, setTestData] = useState(testsDataEN);

// Function to toggle language
const toggleLanguage = () => {
  setLanguage(language === 'en' ? 'es' : 'en');
  setTestData(language === 'en' ? testsDataES : testsDataEN)
};



//

    const [titles, setTitles] = useState([])
    const [availTest, setAvailTest] = useState([])
    const [classCode, setClassCode] = useState('')
    const [quizCode, setQuizCode] = useState('')

    useEffect(() => {
        let tList = (testsData.map(x => x.courseName))
        setTitles([...new Set(tList)])
    }, [testsData])

    useEffect(() => {

    }, [testsData])
    // User Inputs
    const [user, handleChange] = useForm({
        fname: '',
        lname: '',
        email: '',
        pname: '',
        pemail: '',
    });
    // Dropdowns
    const classCodeSelectChanged = (e) => {
        // let selectedCode = e.target.value
        let selectedCode = e
        setClassCode(selectedCode)
        let quizzes = testsData.filter(x => x.courseName === selectedCode)
        setAvailTest(quizzes)
    }
    const selectedTest = (e) => {
        let selectedCode = e.target.value
          setQuizCode(selectedCode)
    }

    // "https://cors-anywhere.herokuapp.com/http://ec2-54-205-248-111.compute-1.amazonaws.com:5000/api/courses/prf"
    function postForm(obj) {
        obj = JSON.stringify(obj);
        fetch("https://prfbackend.cbtseminary.com/api/courses/prf", {
            method: "POST",
            mode: 'cors',
            body: obj,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((x) => {
            if (x.status === 200) {
                Swal.fire(
                    language === 'en' ? "Form submitted!" : "¡Formulario enviado!",
                    language === 'en' 
                        ? "If your proctor does not receive the password within one minute, please resubmit this form or email: course.info@cbtseminary.org" 
                        : "Si tu supervisor no recibe la contraseña en un minuto, por favor reenvía este formulario o envía un correo a: course.info@cbtseminary.org",
                    "success"
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: language === 'en' ? 'Oops...' : 'Vaya...',
                    text: language === 'en' 
                        ? 'Something went wrong!' 
                        : '¡Algo salió mal!',
                    footer: language === 'en' 
                        ? 'Email your request to course.info@cbtseminary.org' 
                        : 'Envía tu solicitud a course.info@cbtseminary.org'
                })
            }
        });
    }
    // Form Submission
    const submitForm = (e) => {
        e.preventDefault()
        let formData = {
            studentFirst: user.fname,
            studentLast: user.lname,
            studentEmail: user.email,
            proctorName: user.pname,
            proctorEmail: user.pemail,
            classCodeSelected: classCode,
            testNumberSelected: quizCode,
            formLanguage: language
        }
        if (formData.studentEmail !== formData.proctorEmail) {
            postForm(formData);

        } else {
            language==="en"? alert("Invalid Proctor Email"): alert("El correo del supervisor no puede ser el mismo que el estudiante.") 
        }

    }

    return (
        <div>
                <button 
                onClick={toggleLanguage} 
                className="btn btn-primary btn-lg mt-3 btn-block w-100" style={{ borderColor: 'transparent', color: 'black' }}
                >
                {language === 'en' ? 'Traducir al Español' : 'Translate to English'}
                </button>

          {language === 'en' ? (
                   <div className="container">
            <h2 style={{ color: '#0d6cbf' }}>Password Request Form</h2>
            <div className="form-container">

                <form id="mainForm">
                    <div className="form-group w-100">
                        <label htmlFor="studentFirst">First Name</label>
                        <input required type="text" className="form-control" id="studentFirst" name="fname" value={user.fname} onChange={handleChange} />
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="studentLast">Last Name</label>
                        <input required type="text" className="form-control" id="studentLast" name="lname" value={user.lname} onChange={handleChange} />
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="studentEmail">Student Email</label>
                        <input required type="email" className="form-control" id="studentEmail" name="email" value={user.email} onChange={handleChange} />
                        <small>student@example.com</small>
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="proctorName">Proctor Name</label>
                        <input required type="text" className="form-control" id="proctorName" name="pname" value={user.pname} onChange={handleChange} />
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="proctorEmail">Proctor Email</label>
                        <input required type="email" className="form-control" id="proctorEmail" name="pemail" value={user.pemail} onChange={handleChange} />
                        <small>proctor@example.com</small>
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="classCode">Class Code &amp; Title
                            <span className="form-required">
                                *
                            </span></label>
                        <Select options={titles.map((x, idx) => ({value:x, label:x}))} onChange={(e) => {classCodeSelectChanged(e.value)}} />
                    </div>

                    <div className="form-group w-100">
                        <label htmlFor="testNumber">Quiz/Test number
                            <span className="form-required">
                                *
                            </span></label>
                        <select required className="form-control" id="testNumber" value={quizCode} onChange={(e) => selectedTest(e)}>
                            <option value="none" defaultValue="" disabled="" hidden="">Select Quiz/Test</option>
                            {availTest.map((x, idx) => (
                                <option key={idx} value={x.testName}>{x.testName}</option>
                            ))}

                        </select>
                    </div>
                    <button type="submit" className="btn  btn-sm btn-block w-100 shadow-sm" onClick={e => submitForm(e)}>
                        Submit
                    </button>
                </form>
                <div style={{ margin: '2rem' }}>
                    If you are unable to submit this form sucessfully, please email your request to <a href="mailto:course.info@cbtseminary.org">course.info@cbtseminary.org</a>
                    .
                </div>
            </div>
        </div>
          ) : (
            <div className="container">
              <h2 style={{ color: '#0d6cbf' }}>Formulario de Solicitud de Contraseña</h2>
              <div className="form-container">
                <form id="mainForm">
                  <div className="form-group w-100">
                    <label htmlFor="studentFirst">Nombre</label>
                    <input required type="text" className="form-control" id="studentFirst" name="fname" value={user.fname} onChange={handleChange} />
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="studentLast">Apellido</label>
                    <input required type="text" className="form-control" id="studentLast" name="lname" value={user.lname} onChange={handleChange} />
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="studentEmail">Correo Electrónico del Estudiante</label>
                    <input required type="email" className="form-control" id="studentEmail" name="email" value={user.email} onChange={handleChange} />
                    <small>estudiante@ejemplo.com</small>
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="proctorName">Nombre Completo del Supervisor</label>
                    <input required type="text" className="form-control" id="proctorName" name="pname" value={user.pname} onChange={handleChange} />
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="proctorEmail">Correo Electrónico del Supervisor</label>
                    <input required type="email" className="form-control" id="proctorEmail" name="pemail" value={user.pemail} onChange={handleChange} />
                    <small>supervisor@ejemplo.com</small>
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="classCode">Código y Título de la Clase<span className="form-required">*</span></label>
                    <Select options={titles.map((x, idx) => ({ value: x, label: x }))} onChange={(e) => { classCodeSelectChanged(e.value) }} />
                  </div>
                  <div className="form-group w-100">
                    <label htmlFor="testNumber">Número de Prueba/Examen<span className="form-required">*</span></label>
                    <select required className="form-control" id="testNumber" value={quizCode} onChange={(e) => selectedTest(e)}>
                      <option value="none" defaultValue="" disabled="" hidden="">Seleccionar Prueba/Examen</option>
                      {availTest.map((x, idx) => (
                        <option key={idx} value={x.testName}>{x.testName}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn  btn-sm btn-block w-100 shadow-sm" onClick={e => submitForm(e)}>
                    Enviar
                  </button>
                </form>
                <div style={{ margin: '2rem' }}>
                  Si no logras enviar este formulario, envía tu solicitud a <a href="mailto:course.info@cbtseminary.org">course.info@cbtseminary.org</a>.
                </div>
              </div>
            </div>
          )}
        </div>
      );

}
export default PRF