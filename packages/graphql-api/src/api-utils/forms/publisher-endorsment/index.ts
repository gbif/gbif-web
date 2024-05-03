import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { confirmEndorsment } from "./confirm-endorsment";

const Schema = {
  body: z.object({
    key: z.string(),
    code: z.string(),
  })
}

export type ConfirmEndorsmentDTO = z.infer<typeof Schema['body']>;

export function registerConfirmEndorsment(router: Router) {
  router.post('/confirm-endorsment', validateRequest(Schema), async (req, res) => {
    try {
      const result = await confirmEndorsment(req.body);
      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });
}