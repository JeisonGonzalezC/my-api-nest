import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContentfulId1744751266830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE products
            ADD COLUMN contentful_id VARCHAR(255) UNIQUE NOT NULL;
        `);

    await queryRunner.query(`
            CREATE INDEX idx_contentful_id ON products(contentful_id);
        `);

    await queryRunner.query(`
            ALTER TABLE products
            ADD CONSTRAINT uq_product_contentful_id UNIQUE (contentful_id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE products
            DROP CONSTRAINT uq_product_contentful_id;
        `);

    await queryRunner.query(`
            DROP INDEX idx_contentful_id ON products;
        `);

    await queryRunner.query(`
            ALTER TABLE products
            DROP COLUMN contentful_id;
        `);
  }
}
