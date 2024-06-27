export class RemoveClubPostCommentDto {
  id: number;

  clubPostId: number;

  userId: number;

  constructor(removeClubPostCommentDto: RemoveClubPostCommentDto) {
    this.id = removeClubPostCommentDto.id;
    this.clubPostId = removeClubPostCommentDto.clubPostId;
    this.userId = removeClubPostCommentDto.userId;
  }
}
