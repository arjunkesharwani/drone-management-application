import { Router } from 'express';

export class Route {
  public path!: string;
  public router!: Router;

  constructor(path: string, router: Router) {
    this.path = path;
    this.router = router;
  }
}

export type Routes = Route[];
