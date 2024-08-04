import express, { Request, Response, NextFunction } from 'express';
import { Resource } from '../models/Resource.model';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.query;
      let filter: any = {};
  
      if (name) {
        filter.name = { $regex: name, $options: 'i' }; 
      }
      if (description) {
        filter.description = { $regex: description, $options: 'i' };
      }
  
      const foundResources = await Resource.find(filter).exec();
      res.render('resources.hbs', { resources: foundResources, filtering: (name || description) ? true : false});
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

router.get('/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('createResource.hbs');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.render('createResource.hbs', { errorMessage: 'All fields are mandatory. Please provide name for resource and description' });
    return;
  }

  try {
    await Resource.create({ name, description });
    res.redirect('/resource');
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
});

router.get('/details/:resourceId', (req: Request, res: Response, next: NextFunction) => {

    Resource.findById(req.params.resourceId)
    .then((foundResource) => {
        res.render('resourceDetails.hbs', {foundResource})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  });

  router.get('/delete/:resourceId', (req: Request, res: Response, next: NextFunction) => {

    Resource.findByIdAndDelete(req.params.resourceId)
    .then(() => {
        res.redirect('/resource');
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  });

  router.get('/edit/:resourceId', (req: Request, res: Response, next: NextFunction) => {

    Resource.findById(req.params.resourceId)
    .then((foundResource) => {
        res.render('editResource.hbs',{foundResource});
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  });

  router.post('/edit/:resourceId', async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
  
    try {
      await Resource.findByIdAndUpdate(
        req.params.resourceId,
        {
          name,
          description,
        },
        {new: true}
    );
    res.redirect(`/resource/details/${req.params.resourceId}`);
    } catch (error) {
      console.log("Error", error);
      next(error);
    }
  });


export default router;