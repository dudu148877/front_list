import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
 
  const navigate = useNavigate();
  useEffect(() => {
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', currentPage);
 },[ loading, currentPage])
  const fetchTasks = useCallback(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");




    console.log('sidajsdiasjdpiajdas', name)
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',token)
    if (!token) {
      navigate("/");
      return;
    }


   
   
  
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/tasks?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const newTasks = response.data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
        setTotalPages(response.data.last_page);
        setLoading(false);
        setIsFetchingMore(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar tarefas", error);
        setError("Erro ao carregar tarefas");
        setLoading(false);
        setIsFetchingMore(false);
      });
  }, [currentPage, navigate]);



 
  useEffect(() => {
    fetchTasks();
  }, [currentPage, fetchTasks]);

  const handleCreateTask = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para criar uma tarefa.");
      return;
    }

    axios
      .post(
        "http://localhost:8000/api/tasks",
        { title: newTask.title, description: newTask.description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setTasks((prevTasks) => [response.data, ...prevTasks]);
        setNewTask({ title: "", description: "" });
      })
      .catch((error) => {
        console.error("Erro ao criar tarefa", error);
        setError("Erro ao criar tarefa");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10
    ) {
      if (currentPage < totalPages && !isFetchingMore) {
        setIsFetchingMore(true);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };





  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, totalPages, isFetchingMore]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard de Tarefas
          </Typography>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Seja Bem-vindo 
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {loading && currentPage === 1 ? (
          <Typography align="center">Carregando...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            {/* Formulário de Criação de Tarefa */}
            <Typography variant="h5" gutterBottom>
              Criar Nova Tarefa
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTask();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 4,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: 1,
              }}
            >
              <TextField
                label="Título"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Descrição"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary">
                Criar Tarefa
              </Button>
            </Box>

            {/* Linha do Tempo das Tarefas */}
            <Typography variant="h5" gutterBottom>
              Tarefas
            </Typography>
            <Timeline position="alternate-reverse">
              {tasks.map((task) => (
                <TimelineItem key={task.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      color={task.completed === "1" ? "success" : "error"}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description || "Sem descrição"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Completada:</strong>{" "}
                      {task.completed === "1" ? "Sim" : "Não"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Criada em: {new Date(task.created_at).toLocaleString()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            {isFetchingMore && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
