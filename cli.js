#!/usr/bin/env node

const archivo = require("./tasks.json");
const crypto = require("crypto");
const fs = require("fs");

command = process.argv[2];

const list = (status) => {
  if (!/todo|done|in-progess/.test(status)) {
    console.error("Status de tarea no existe.");
    return;
  }
  console.log(archivo.tasks.filter((e) => e.status === status));
};

const WriteArchive = (data, text) => {
  fs.writeFile("tasks.json", JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }
    console.log(text);
  });
};

switch (command) {
  case "list":
    if (process.argv[3]) {
      list(process.argv[3]);
    } else {
      console.log(archivo.tasks);
    }
    break;
  case "add":
    if (process.argv[3]) {
      task = {
        id: crypto.randomUUID(),
        description: process.argv[3],
        status: "todo",
        createdAt: new Date(),
        updatedAt: null,
      };
      archivo.tasks.push(task);
      WriteArchive(archivo, `Task added successfully (ID: ${task.id})`);
    } else {
      console.error("Añada una tarea en especifico");
    }
    break;
  case "mark-in-progress":
    if (process.argv[3]) {
      archivo.tasks = archivo.tasks.map((e) =>
        e.id == process.argv[3]
          ? { ...e, status: "in-progress", updatedAt: new Date() }
          : e
      );
      WriteArchive(archivo, `Task (ID: ${process.argv[3]}) marked in-progess`);
    } else {
      console.log("proporcione un id valido");
    }
    break;
  case "mark-done":
    if (process.argv[3]) {
      archivo.tasks = archivo.tasks.map((e) =>
        e.id == process.argv[3]
          ? { ...e, status: "done", updatedAt: new Date() }
          : e
      );
      WriteArchive(archivo, `Task (ID: ${process.argv[3]}) marked done`);
    } else {
      console.log("proporcione un id valido");
    }
    break;
  case "delete":
    if (process.argv[3]) {
      let length = archivo.tasks.length;
      archivo.tasks = archivo.tasks.filter((e) => e.id != process.argv[3]);
      if (length !== archivo.tasks.length) {
        WriteArchive(archivo, `Task (ID: ${process.argv[3]}) deleted`);
      } else {
        console.log("ID de task no existe");
      }
    } else {
      console.log("proporcione un id valido");
    }
    break;
  case "update":
    if (process.argv[3] && process.argv[4]) {
      archivo.tasks = archivo.tasks.map((e) =>
        e.id == process.argv[3]
          ? { ...e, description:process.argv[4], updatedAt: new Date() }
          : e
      );
      WriteArchive(archivo, `Task (ID: ${process.argv[3]}) updated`);
    } else {
      console.log("proporcione un id valido");
    }
    break;
}
