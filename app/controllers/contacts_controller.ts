import Contact from '#models/contact'
import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator';


export default class ContactsController {
  public async create({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true }, [
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
      ]),
      phone: schema.string({ trim: true }, [
      ])
    });

    const contactData = await request.validate({
      schema: validationSchema,
      messages: {
        'name.required': 'O campo nome é obrigatório',
        'email.required': 'O campo e-mail é obrigatório',
        'email.email': 'O e-mail fornecido não é válido',
        'email.unique': 'Este e-mail já está em uso',
        'phone.required': 'O campo telefone é obrigatório',
      }
    });

    try {
      const contact = await Contact.create(contactData);
      return response.status(201).json(contact);
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Failed to create contact.' });
    }
  }
  
    public async index({ response }: HttpContext) {
      try {
        const contacts = await Contact.all();
        return response.status(200).json(contacts);
      } catch (error) {
        console.error(error);
        return response.status(400).json({ error: 'Failed to fetch contacts.' });
      }
    }
  
    public async show({ params, response }: HttpContext) {
      try {
        const contact = await Contact.findOrFail(params.id);
        return response.status(200).json(contact);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  
    public async update({ params, request, response }: HttpContext) {
      const contactData = request.only(['name', 'email', 'phone']);
  
      try {
        const contact = await Contact.findOrFail(params.id);
        contact.merge(contactData);
        await contact.save();
        return response.status(200).json(contact);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  
    public async destroy({ params, response }: HttpContext) {
      try {
        const contact = await Contact.findOrFail(params.id);
        await contact.delete();
        return response.status(204);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  }