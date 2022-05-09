import Author from 'App/Models/Author'

class AuthorHandler {
  public async processAuthor(authenticatedUser: Author): Promise<void> {
    // Searches for the author in the database
    let author = await Author.find(authenticatedUser.id)

    // If the author does not exists, we create a new one:
    if (!author) {
      author = new Author()
      author.id = authenticatedUser.id
    }

    // If the author and/or name are different from the actual data
    // in the object representing the authenticated user
    if (author.email !== authenticatedUser.email || author.name !== authenticatedUser.name) {
      author.email = authenticatedUser.email
      author.name = authenticatedUser.name

      await author.save()
    }
  }
}

export default new AuthorHandler()