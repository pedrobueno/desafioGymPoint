import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const list = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(list);
  }

  async show(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id, {
      attributes: ['id', 'title', 'duration', 'price'],
    });

    if (!plan) {
      res.status(400).json({ error: 'The plan does not exist' });
    }
    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const exists = await Plan.findOne({ where: { title: req.body.title } });
    if (exists) {
      return res
        .status(403)
        .json({ error: 'There is already a plan with this name' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;
    const plan = await Plan.findByPk(id, {
      attributes: ['id', 'title', 'duration', 'price'],
    });
    if (!plan) {
      return res.status(403).json({ error: 'The plan does not exist' });
    }

    if (req.body.title) {
      const exists = await Plan.findOne({
        where: { title: req.body.title },
      });
      if (exists && exists.id !== plan.id) {
        return res
          .status(403)
          .json({ error: 'There is already a plan with this name' });
      }
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({ title, duration, price });
  }

  async delete(req, res) {
    const { id } = req.params;

    await Plan.destroy({ where: { id } });

    return res.json({ message: 'Plan deleted' });
  }
}

export default new PlanController();
