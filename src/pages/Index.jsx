import React, { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, VStack, useToast, IconButton, Heading, Textarea } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: "", description: "", date: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/events");
      const data = await response.json();
      setEvents(data.data);
    } catch (error) {
      toast({
        title: "Error fetching events",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e, field) => {
    setNewEvent({ ...newEvent, [field]: e.target.value });
  };

  const handleEditChange = (e, field) => {
    setEditingEvent({ ...editingEvent, [field]: e.target.value });
  };

  const addEvent = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: newEvent }),
      });
      await response.json();
      fetchEvents();
      setNewEvent({ name: "", description: "", date: "" });
      toast({
        title: "Event created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating event",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const editEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: editingEvent }),
      });
      await response.json();
      fetchEvents();
      setEditingEvent(null);
      toast({
        title: "Event updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating event",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/api/events/${id}`, {
        method: "DELETE",
      });
      await response.json();
      fetchEvents();
      toast({
        title: "Event deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={5}>Event Manager</Heading>
      <VStack spacing={4} align="stretch">
        {events.map((event) => (
          <Flex key={event.id} p={3} borderWidth="1px" borderRadius="lg" alignItems="center" justifyContent="space-between">
            <Box>
              <Text fontWeight="bold">{event.attributes.name}</Text>
              <Text>{event.attributes.description}</Text>
              <Text fontSize="sm">{new Date(event.attributes.date).toLocaleDateString()}</Text>
            </Box>
            <Box>
              <IconButton icon={<FaEdit />} onClick={() => setEditingEvent(event.attributes)} m={1} />
              <IconButton icon={<FaTrash />} onClick={() => deleteEvent(event.id)} m={1} />
            </Box>
          </Flex>
        ))}
      </VStack>
      <Box mt={5}>
        <Heading size="md">Add New Event</Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={newEvent.name} onChange={(e) => handleInputChange(e, "name")} />
          <FormLabel>Description</FormLabel>
          <Textarea value={newEvent.description} onChange={(e) => handleInputChange(e, "description")} />
          <FormLabel>Date</FormLabel>
          <Input type="date" value={newEvent.date} onChange={(e) => handleInputChange(e, "date")} />
          <Button leftIcon={<FaPlus />} colorScheme="blue" mt={3} onClick={addEvent}>
            Add Event
          </Button>
        </FormControl>
      </Box>
      {editingEvent && (
        <Box mt={5}>
          <Heading size="md">Edit Event</Heading>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={editingEvent.name} onChange={(e) => handleEditChange(e, "name")} />
            <FormLabel>Description</FormLabel>
            <Textarea value={editingEvent.description} onChange={(e) => handleEditChange(e, "description")} />
            <FormLabel>Date</FormLabel>
            <Input type="date" value={editingEvent.date} onChange={(e) => handleEditChange(e, "date")} />
            <Button leftIcon={<FaEdit />} colorScheme="green" mt={3} onClick={() => editEvent(editingEvent.id)}>
              Update Event
            </Button>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default Index;
