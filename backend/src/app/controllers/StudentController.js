import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const list = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });

    return res.json(list);
  }

  async show(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      attributes: ['name', 'email', 'age', 'weight', 'height'],
    });

    if (!student) {
      res.status(400).json({ error: 'The student does not exist' });
    }
    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const exists = await Student.findOne({ where: { email: req.body.email } });
    if (exists) {
      return res
        .status(403)
        .json({ error: 'There is already a student with this email' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;
    const student = await Student.findByPk(id, {
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });
    if (!student) {
      return res.status(403).json({ error: 'The student does not exist' });
    }

    if (req.body.email) {
      const exists = await Student.findOne({
        where: { email: req.body.email },
      });
      if (exists && exists.id !== student.id) {
        return res
          .status(403)
          .json({ error: 'There is already a student with this email' });
      }
    }

    const { name, email, age, weight, height } = await student.update(req.body);

    return res.json({ name, email, age, weight, height });
  }
}

export default new StudentController();
