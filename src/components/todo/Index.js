import axios from "axios";
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from 'formik'
import * as Yup from 'yup'
const Index = () => {
    const [todoList,setTodoList] = useState([]);
    const [form, setForm ] = useState ({taskTitle: "",taskDes: "" ,deadLine: ""})
    const formSchema = Yup.object().shape({
        taskTitle: Yup.string().max(50).required(),
        taskDes: Yup.string().max(100).required(),
        deadLine: Yup.string().min(8).max(10)
    })
    const [mode,setMode] = useState ({type: 'add', action: 'Submit'})
    useEffect (()=>{
        axios.get("http://localhost:3001/todos")
        .then (res => {setTodoList(res.data)})
        .catch(err => {
            console.log(err)
        })
    },[])
    const handleChange = (e) => {
        setForm({...form,[e.target.name ]: e.target.value})
    }
    const handleEdit = (index) => {
        setMode({type: 'edit',action:"Save",selectedIndex : index});
        setForm({...todoList[index]})
    }
    const handleDelete = (index) => {
        let confirmation = window.confirm("Are you sure to delete this item?")
        if (confirmation) {
            axios.delete(`http://localhost:3001/todos/${todoList[index].id}`)
                .then (res =>{
                    console.log(res)
                    let afterDeleteArray = todoList.filter (todo => todo.id != todoList[index].id);
                    setTodoList ([...afterDeleteArray])
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    return (
        <div className="container pt-3" >
            <h2>Todo List</h2>
            <Formik
                initialValues={form}
                enableReinitialize={true}
                validationSchema={formSchema}
                onSubmit={(values) => {
                   if(mode.type === 'edit'){
                        let id = todoList[mode.selectedIndex].id;
                        axios.put (`http://localhost:3001/todos/${id}`,values)
                            .then(res => {
                                setForm([{taskTitle: "",taskDes: "" ,deadLine: ""}]);
                                setMode({type: 'add', action: 'Submit'});
                                let updateArray = todoList;
                                updateArray[mode.selectedIndex] =values;
                                setTodoList([...updateArray]);
                            })
                            .catch (err =>{console.log(err)})
                   }else{
                    axios.post('http://localhost:3001/todos', {
                        taskTitle: values.taskTitle,
                        taskDes: values.taskDes,
                        deadLine: values.deadLine
                    })
                    .then(res => {
                        setForm([{taskTitle: "",taskDes: "" ,deadLine: ""}]);
                        setMode({type: 'add', action: 'Submit'});
                        let addArray = todoList;
                        values.id =res.data.id
                        addArray.push(values);
                        setTodoList([...addArray]);
                    })
                    .catch (err =>{console.log(err)})
                   }
                }}
            >
                <Form>
                    <p className="mb-2">Task Title</p>
                    <Field name="taskTitle" placeholder="Enter a task title" value={form.taskTitle || ""} onChange={handleChange}></Field>
                    <ErrorMessage component="div" name='taskTitle' className='text-danger'></ErrorMessage>
                    <br />
                    <p className="mb-2">Task Des</p>
                    <Field name="taskDes" placeholder="Enter a task Description" value={form.taskDes || ""} onChange={handleChange}></Field>
                    <ErrorMessage component="div" name='taskDes' className='text-danger'></ErrorMessage>
                    <br />
                    <p className="mb-2">Deadline</p>
                    <Field name="deadLine" type="date" value={form.deadLine || ""} onChange={handleChange}></Field>
                    <ErrorMessage component="div" name='deadLine' className='text-danger'></ErrorMessage>
                    <br />
                    <br />
                    <button type='submit' className='d-block mt-2 btn btn-success'>{mode.action}</button>
                </Form>
            </Formik>
            <hr />
            <table className="table table-hover table-stripe">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Task title</th>
                        <th>Task Description</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    todoList.map((row,index)=> (
                        <tr key={index} >
                            <td>{row.id}</td>
                            <td>{row.taskTitle}</td>
                            <td>{row.taskDes}</td>
                            <td>{row.deadLine}</td>
                            <td>
                                <button className='btn btn-warning m-2' onClick={() => handleEdit(index)}>Edit</button>
                                <button className='btn btn-danger m-2' onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>



        </div>
    )
}
export default Index