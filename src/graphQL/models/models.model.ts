/**
 * Mother Class
 */
export class Models {

  /**
   * Dynamically import a Graphql model to add custom prototype
   * @param models
   */
  constructor(models: any) {
    Object.keys(models).map(key => {
      this[key] = models[key];
    });
  }
}
