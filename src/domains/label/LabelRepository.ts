import { Label } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { ImportLabelDto } from "./types/ImportLabelDto"

export default class LabelRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async createLabel(label: Label, groupId: string) {
    const createdLabel = await this.prismaClient.label.create({
      data: {
        ...label,
        id: undefined,
        groupId,
      },
    })

    return createdLabel
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
    })

    return editedLabel
  }

  async findLabelById(labelId: string) {
    const label = await this.prismaClient.label.findFirst({
      where: {
        id: labelId,
      },
    })
    return label
  }

  async findLabelsByGroup(groupId: string) {
    const labels = await this.prismaClient.label.findMany({
      where: {
        groupId,
      },
    })

    return labels
  }

  async deleteLabel(labelId: string) {
    const deletedLabel = await this.prismaClient.label.delete({
      where: {
        id: labelId,
      },
    })

    return deletedLabel
  }

  async findLabelsByGroupIds(groupIds: string[]) {
    const labels = await this.prismaClient.label.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
      },
      include: {
        group: true,
      },
    })

    return labels
  }

  async createManyLabels(groupId: string, labelDtos: ImportLabelDto[]) {
    const createdLabels = await this.prismaClient.$transaction(
      labelDtos.map((labelDto) => {
        return this.prismaClient.label.create({
          data: {
            ...labelDto,
            groupId,
          },
        })
      })
    )
    return createdLabels
  }

  async updateMany(labels: Label[]) {
    const editedLabels = await this.prismaClient.$transaction(
      labels.map((label) => {
        return this.prismaClient.label.update({
          where: {
            id: label.id,
          },
          data: {
            ...label,
            updatedAt: undefined,
            createdAt: undefined,
          },
        })
      })
    )
    return editedLabels
  }
}
