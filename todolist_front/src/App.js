
import './App.css';
import { css, Global } from '@emotion/react';
import MainContainer from './components/MainContainer/MainContainer';
import MainLayout from './components/MainLayout/MainLayout';
import { reset } from './styles/global';
import axios from 'axios';
import React, { useState } from 'react';
import ReactModal from 'react-modal';


function App() {
    const [ isModalOpen, setModalOpen ] = useState(false);

  // 조회

    const [ todo, setTodo ] = useState({
        todoId: "",
        checkStatus: "",
        content: "",
        registerDate: "",
    });

    const [ updateTodo, setUpdateTodo ] = useState({
        todoId: "",
        content: "",
        registerDate: "",
    });

    const [ params, setParams ] = useState({
        registerDate: "",
    })

    const [ todoList, setTodoList ] = useState([]);

    const requestTodoList = async () => {
        try{
            const response = await axios.get("http://localhost:8080/api/v1/todolist", {params});
            setTodoList(response.data);
        }catch(e) {
            console.error(e);
        };
    }

    const handleSearchClick = () => {
            
        requestTodoList();

        setParams({
            todoId: "",
            checkStatus: "",
            content: "",
            registerDate: "",
        });

    }
// useEffect(() => {
//     const getLists = async () => {
//         const response = await axios.get("http://localhost:8080/api/v1/todolist");
//         setTodoListOption(response.data);
//         setTodoList(list => ({
//             ...list,
//             listId: response.data[0].listId
//             })
//         );
//     }
//     getLists();
// }, []);


// const handleSubmitClick = async () => {
//     try {
//                  const response = await axios.get("http://localhost:8080/api/v1/todolist", todoList);
//                  setTodoListOption(response.data);
//              }catch(e) {
//                  console.error(e);
//              };
// }

// 생성

// 삭제
const requestDeleteList = async (todoId) => {
    let responseData = null;
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1/todolist/${todoId}`);
        responseData = response.data;
    } catch (e) {
        console.error(e);
    }

    return responseData;
}

const handleDeleteListClick = async (todoId) => {
    if(window.confirm("삭제하시겠습니까?")) {
        await requestDeleteList(todoId);
        await requestTodoList();
        alert("삭제 완료");
    }
}

// 수정

const closeModal = () => {
    setModalOpen(false);
    setUpdateTodo({
        todoId: "",
        content: "",
        registerDate: "",
    })
}

const handleUpdateTodoClick = async (todoId) => {

    setModalOpen(true);
    const data = await requestTodoList(todoId); // x
    setUpdateTodo(data);
}

const handleUpdateSubmitClick = async () => {
    await requestUpdateTodo();
    await requestTodoList();
    closeModal();
}

const requestUpdateTodo = async () => {
    let responseData = null;

    try {
        const response = await axios.put(`http://localhost:8080/api/v1/todolist/${updateTodo.todoId}`, updateTodo)
        responseData = response.data;
    } catch (e) {
        console.error(e);
    }
    return responseData;
}

const handleUpdateInputChange = (e) => {
    setUpdateTodo(ut => {
        return {
            ...ut,
            [e.target.name]: e.target.value
        }
    })
}



  return (
    <>
      <Global css={reset}/>
          <MainLayout>
            <MainContainer>
            
            <ReactModal 
                style={{
                    content: {
                        boxSizing: "border-box",
                        transform: "translate(-50%, -50%)",
                        top: "50%",
                        left: "50%",
                        padding: "20px",
                        width: "800px",
                        height: "400px",
                        backgroundColor: "#fafafa",

                    }
                }}
                isOpen={isModalOpen}
                onRequestClose={closeModal}

            >
                <div css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    height: 100%;
                `}>
                    <h2>todo 정보 수정</h2>
                    <input type="text" name="todoId" onChange={handleUpdateInputChange} value={updateTodo.todoId} disabled={true}/> 
                    <input type="text" name="content" placeholder='오늘 할 일' onChange={handleUpdateInputChange} value={updateTodo.content} /> 
                    <input type="date" name="registerDate" onChange={handleUpdateInputChange} value={updateTodo.registerDate} /> 
                    <div>
                        <button onClick={() => handleUpdateSubmitClick()}>확인</button>
                        <button onClick={() => closeModal()}>취소</button>
                    </div>
                </div>
            </ReactModal>

            <div >
                

                <div class="container">
                        <h1>todolist</h1>
                    <p class="input-box">
                        <input type="text" placeholder='ID'/>
                        <input type="password" placeholder='password'/>
                        <button class="login-bt">확인</button>
                    </p>

                    <div class="list-container">
                        <div class="list">
                        <div class="sc-box">
                        <h2>전체 List</h2>
                        <button onClick={handleSearchClick} class="sc">전체 조회</button>
                    </div>
                    <div >
                        <table>
                            <thead>
                                <tr >
                                    <th>선택</th>
                                    <th>내용</th>
                                    <th>날짜</th>
                                    <th>수정</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                    todoList.map(todo =>
                                        <tr key={todo.todoId}>
                                            <td><input type="checkbox" checked={!!todo.checkStatus}/></td>
                                            <td>{todo.content}</td>
                                            <td>{todo.registerDate}</td>
                                            <td><button onClick={() => handleUpdateTodoClick(todoList.todoId)}>수정</button></td>
                                            <td><button onClick={() => handleDeleteListClick(todoList.todoId)}>삭제</button></td>
                                        </tr>
                        
                                    )    
                                }
                            </tbody>    
                        </table>
                    </div>

                </div>
                    <div class="list">
                    <div class="sc-box">
            <h2>미완료 List</h2>
            <button  class="sc">미완료 조회</button>
        </div>
        <div >
            <table>
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>내용</th>
                        <th>날짜</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {
                        todoList.filter(todo => !todo.checkStatus).map(todo =>
                            <tr key={todo.todoId}>
                                <td><input type="checkbox" checked={!!todo.checkStatus}/></td>
                                <td>{todo.content}</td>
                                <td>{todo.registerDate}</td>
                                <td><button>수정</button></td>
                                <td><button>삭제</button></td>
                            </tr>
                
                        )    
                    }

                </tbody>    
            </table>
        </div>
  
                    </div>
                    <div class="list">
                    <div class="sc-box">
                    <h2>완료 List</h2>
                     <button  class="sc">완료 조회</button>
                </div>
                <div >
                    <table>
                        <thead>
                            <tr >
                                <th>선택</th>
                                <th>내용</th>
                                <th>날짜</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        {
                            todoList.filter(todo => !!todo.checkStatus).map(todo =>
                                <tr key={todo.todoId}>
                                    <td><input type="checkbox" checked={!!todo.checkStatus}/></td>
                                    <td>{todo.content}</td>
                                    <td>{todo.registerDate}</td>
                                    <td><button>수정</button></td>
                                    <td><button>삭제</button></td>
                                </tr>
                    
                            )    
                        }
                        </tbody>    
                    </table>
                </div>

                    </div> 
                    
                </div>

            </div>
       </div>

            </MainContainer>

          </MainLayout>
    </>
  );
}

export default App;
