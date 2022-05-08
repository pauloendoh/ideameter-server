import { Label } from "@prisma/client";
import ForbiddenError403 from "../../utils/errors/ForbiddenError403";
import NotFoundError404 from "../../utils/errors/NotFoundError404";
import GroupRepository from "../group/GroupRepository";
import LabelRepository from "./LabelRepository";

export default class LabelService {
  constructor(
    private readonly labelRepository = new LabelRepository(),
    private readonly groupRepository = new GroupRepository()
  ) {}

  async findLabelsByGroup(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group");

    const labels = await this.labelRepository.findLabelsByGroup(groupId);
    return labels;
  }

  async createLabel(label: Label, groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );

    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add labels to this group"
      );

    const createdLabel = await this.labelRepository.createLabel(label, groupId);
    return createdLabel;
  }

  async updateLabel(label: Label, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      label.groupId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to edit this label");

    const editedLabel = await this.labelRepository.updateLabel(label);
    return editedLabel;
  }

  async deleteLabel(labelId: string, requesterId: string) {
    const label = await this.labelRepository.findLabelById(labelId);
    if (!label) throw new NotFoundError404("Label not found");

    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      label.groupId
    );

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group");

    const deletedLabel = await this.labelRepository.deleteLabel(labelId);
    return deletedLabel;
  }
}
