export class Movie {
  constructor(
    public id: number,
    public title: string,
    public duration: number,
    public genres: string[],
    public year: number,
    public score: number,
    public overview: string,
    public imgPath: string,
    public isMovie: boolean
  ) {}
}
