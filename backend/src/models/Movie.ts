// =====================================================
// Movie Class - FROM UML CLASS DIAGRAM
// Attributes: movieId, title, synopsis, durationInMinutes, genre
// Methods: getMovieDetails()
// =====================================================

/**
 * Movie class (from UML Class Diagram)
 * Represents a movie in the theatre system
 */
export class Movie {
  private movieId: string;
  private title: string;
  private synopsis: string;
  private durationInMinutes: number;
  private genre: string;
  private language?: string;
  private rating?: string;
  private posterUrl?: string;
  private trailerUrl?: string;
  private releaseDate?: Date;
  private isActive: boolean;

  constructor(
    movieId: string,
    title: string,
    synopsis: string,
    durationInMinutes: number,
    genre: string,
    language?: string,
    rating?: string,
    posterUrl?: string,
    trailerUrl?: string,
    releaseDate?: Date,
    isActive: boolean = true
  ) {
    this.movieId = movieId;
    this.title = title;
    this.synopsis = synopsis;
    this.durationInMinutes = durationInMinutes;
    this.genre = genre;
    this.language = language;
    this.rating = rating;
    this.posterUrl = posterUrl;
    this.trailerUrl = trailerUrl;
    this.releaseDate = releaseDate;
    this.isActive = isActive;
  }

  /**
   * UC6 - Browse Movies
   * Returns detailed information about the movie
   * @returns Movie details as string
   */
  getMovieDetails(): string {
    return `${this.title} (${this.genre}) - ${this.durationInMinutes} mins\n${this.synopsis}`;
  }

  // Getters
  getMovieId(): string {
    return this.movieId;
  }

  getTitle(): string {
    return this.title;
  }

  getSynopsis(): string {
    return this.synopsis;
  }

  getDurationInMinutes(): number {
    return this.durationInMinutes;
  }

  getGenre(): string {
    return this.genre;
  }

  getLanguage(): string | undefined {
    return this.language;
  }

  getRating(): string | undefined {
    return this.rating;
  }

  getPosterUrl(): string | undefined {
    return this.posterUrl;
  }

  getTrailerUrl(): string | undefined {
    return this.trailerUrl;
  }

  getReleaseDate(): Date | undefined {
    return this.releaseDate;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  // Setters
  setTitle(title: string): void {
    this.title = title;
  }

  setSynopsis(synopsis: string): void {
    this.synopsis = synopsis;
  }

  setDurationInMinutes(duration: number): void {
    this.durationInMinutes = duration;
  }

  setGenre(genre: string): void {
    this.genre = genre;
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }
}
