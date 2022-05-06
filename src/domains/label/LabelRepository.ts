import { Label } from "@prisma/client";
import myPrismaClient from "../../utils/myPrismaClient";

export default class LabelRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async createLabel(label: Label, groupId: string) {
    const createdLabel = await this.prismaClient.label.create({
      data: {
        ...label,
        id: undefined,
        groupId,
      },
    });

    return createdLabel;
  }

  async updateLabel(label: Label) {
    const editedLabel = await this.prismaClient.label.update({
      where: {
        id: label.id,
      },
      data: {
        ...label,
        updatedAt: undefined,
      },
    });

    return editedLabel;
  }

  async findLabelById(labelId: string) {
    const label = await this.prismaClient.label.findFirst({
      where: {
        id: labelId,
      },
    });
    return label;
  }

  async findLabelsByGroup(groupId: string) {
    const labels = await this.prismaClient.label.findMany({
      where: {
        groupId,
      },
    });

    return labels;
  }

  async deleteLabel(labelId: string) {
    const deletedLabel = await this.prismaClient.label.delete({
      where: {
        id: labelId,
      },
    });

    return deletedLabel;
  }
}
