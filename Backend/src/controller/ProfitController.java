package com.farmtwin.controller;

import com.farmtwin.dto.Requests.ProfitRequest;
import com.farmtwin.service.MLClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/profit")
public class ProfitController {

    private final MLClientService mlClientService;

    @Autowired
    public ProfitController(MLClientService mlClientService) {
        this.mlClientService = mlClientService;
    }

    @PostMapping("/estimate")
    public Mono<Map> estimateProfit(@Valid @RequestBody ProfitRequest request) {
        return mlClientService.estimateProfit(request);
    }
}
