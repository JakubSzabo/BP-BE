import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {ScriptModel} from '../models/script.model';
import {StatusCodes} from '../enums/statusCode.model';
import {EventModel} from "../models/event.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All Scripts
router.get('', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    try {
        const scripts = await ScriptModel.find().sort({ date: -1 });

        res.send(scripts);
    } catch (error) {
        console.error('Error fetching scripts:', error);
        res.status(500).send('Internal Server Error');
    }
}));

// Get Script by ID
router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const scriptId = req.params.id;

    try {
        const script: ScriptModel | null = await ScriptModel
            .findById(scriptId)
            .populate('events', 'title text date');

        if (!script) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }

        res.json(script);
    } catch (error) {
        console.error('Error fetching script:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

// Create a new Script
router.post('', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const { title, date, events, onMeeting, other } = req.body;

    try {
        if (!title || !date) {
            return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
        }

        const eventIds = [];
        for (const event of events) {
            const { title, date: eventDate, text } = event;
            const newEvent = await EventModel.create({ title: title, date: eventDate, text });
            eventIds.push(newEvent._id);
        }

        const newScript = await ScriptModel.create({
            title,
            date,
            onMeeting: onMeeting || [],
            events: eventIds,
            other: other || ''
        });

        res.status(StatusCodes.Created.code).json(newScript);
    } catch (error) {
        console.error('Error creating script:', error);
        res.status(StatusCodes.InternalServerError.code).send('Internal Server Error');
    }
}));

//Copy
router.put('/copy/:id', authenticateToken, async (req: Request, res: Response) => {
    const scriptId = req.params.id;

    try {
        const originalScript = await ScriptModel.findById(scriptId).populate('events');

        if (!originalScript) {
            return res.status(StatusCodes.NotFound.code).json({ message: StatusCodes.NotFound.description });
        }

        const copiedScriptData = {
            title: `${originalScript.title} (Copy)`,
            date: originalScript.date,
            onMeeting: originalScript.onMeeting || [],
            other: originalScript.other || ''
        };

        const copiedScript = await ScriptModel.create(copiedScriptData);

        const copiedEventIds = [];

        for (const originalEvent of originalScript.events) {
            const existingEvent = await EventModel.findById(originalEvent);

            if (existingEvent) {
                const copiedEventData = {
                    title: existingEvent.title,
                    date: existingEvent.date,
                    text: existingEvent.text
                };

                const copiedEvent = await EventModel.create(copiedEventData);
                copiedEventIds.push(copiedEvent._id);

                copiedScript.events.push(copiedEvent._id);
            }
        }

        await copiedScript.save();

        res.status(StatusCodes.Created.code).json({ copiedScript, copiedEventIds });
    } catch (error) {
        console.error('Error copying script:', error);
        res.status(StatusCodes.InternalServerError.code).json({ message: StatusCodes.InternalServerError.description });
    }
});

// Update Script by ID
router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const scriptId = req.params.id;
    const updates = req.body;

    console.log("UPDATE:", updates)

    try {
        const script = await ScriptModel.findById(scriptId);
        if (!script) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }

        Object.assign(script, updates);

        await script.save();

        if (updates.events && Array.isArray(updates.events)) {
            const updatedEvents = await Promise.all(
                updates.events.map(async (eventData: any) => {
                    const eventId = eventData.id;
                    const { title, text, date } = eventData;

                    let event;

                    if (eventId) {
                        event = await EventModel.findById(eventId);
                    }

                    if (event) {
                        event.title = title;
                        event.text = text;
                        event.date = new Date(date);

                        await event.save();
                    } else {
                        event = await EventModel.create({
                            title,
                            text,
                            date: new Date(date)
                        });

                        script.events.push(event._id);
                        await script.save();
                    }

                    return event;
                })
            );

            console.log('Updated events:', updatedEvents);
        }

        res.send(script);
    } catch (error) {
        console.error('Error updating script:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

// Delete Script by ID
router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const scriptId = req.params.id;

    try {
        const deletedScript = await ScriptModel.findById(scriptId).populate('events');

        if (!deletedScript) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }

        const eventIds = deletedScript.events.map(event => event);

        const deleteEventsPromise = EventModel.deleteMany({ _id: { $in: eventIds } });

        const deleteScriptPromise = ScriptModel.findByIdAndDelete(scriptId);

        await Promise.all([deleteEventsPromise, deleteScriptPromise]);

        res.send({ message: 'Script and associated events deleted successfully' });
    } catch (error) {
        console.error('Error deleting script and associated events:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

export default router;

