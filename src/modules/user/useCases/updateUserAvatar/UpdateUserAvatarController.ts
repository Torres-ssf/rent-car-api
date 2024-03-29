import { UserMap } from '@modules/user/mapper/UserMap';
import { AppError } from '@shared/errors/AppError';
import { deleteMultipleFiles } from '@shared/utils/deleteMultipleFiles';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

export class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const avatar_file = request.file.filename;
    try {
      const updateUserAvatarUseCase = container.resolve(
        UpdateUserAvatarUseCase,
      );

      const updatedUser = await updateUserAvatarUseCase.execute({
        user_id: id,
        user_avatar: avatar_file,
      });

      const userResp = UserMap.toUserResponseDTO(updatedUser);

      return response.json(userResp);
    } catch (err) {
      await deleteMultipleFiles([`./tmp/avatar/${avatar_file}`]);

      throw new AppError(err.message, err.statusCode);
    }
  }
}
