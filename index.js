import { string, validate } from "joi";
import logger from "./logger";
import authenticater from "./authenticater";
import express, { json, urlencoded, static } from "express";
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(static("public")); // serve static content

app.use(logger);
app.use(authenticater);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found!"); // 404
    return;
  } else {
    res.send(course);
  }
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); // result.error
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //lookup the course
  //if not exist -> 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found!"); // 404
  }

  const { error } = validateCourse(req.body); // result.error
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }
  //update the course
  course.name = req.body.name;
  res.send(course);
  // return the updated course
});

app.delete("/api/courses/:id", (req, res) => {
  //lookup the course
  //if not exist -> 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found!"); // 404
    return;
  }

  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1); // remove 1 element from position "index"

  //return to the client
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: string()
      .min(3)
      .required()
  };
  return validate(course, schema);
}

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
