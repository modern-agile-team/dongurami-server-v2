export class RemoveClubPostCommentDto {
  id: string;

  clubPostId: string;

  userId: string;

  constructor(removeClubPostCommentDto: RemoveClubPostCommentDto) {
    this.id = removeClubPostCommentDto.id;
    this.clubPostId = removeClubPostCommentDto.clubPostId;
    this.userId = removeClubPostCommentDto.userId;
  }
}
